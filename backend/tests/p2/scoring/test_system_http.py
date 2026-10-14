"""System tests through a real Uvicorn process and TCP HTTP connection."""

from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from typing import Iterator
from urllib.error import HTTPError, URLError
from urllib.request import ProxyHandler, Request, build_opener

import pytest

BACKEND = Path(__file__).resolve().parents[3]
ROOT = BACKEND.parent
FIXTURE = ROOT / "p2" / "contracts" / "fixtures" / "ranking-request.golden.json"
TOKEN = "p2-system-test-secret"
OPENER = build_opener(ProxyHandler({}))


def unused_local_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


@pytest.fixture(scope="module")
def live_ranker() -> Iterator[str]:
    port = unused_local_port()
    base_url = f"http://127.0.0.1:{port}"
    environment = os.environ.copy()
    environment.pop("GEMINI_KEY", None)
    environment.pop("NEXT_PUBLIC_SUPABASE_URL", None)
    environment.pop("NEXT_PUBLIC_SUPABASE_ANON_KEY", None)
    environment["RECEIPT_INTERNAL_TOKEN"] = TOKEN

    process = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "api.index:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(port),
            "--log-level",
            "warning",
        ],
        cwd=BACKEND,
        env=environment,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if process.poll() is not None:
            output = process.stdout.read() if process.stdout else ""
            pytest.fail(f"Uvicorn exited before startup:\n{output}")
        try:
            with OPENER.open(f"{base_url}/openapi.json", timeout=0.5) as response:
                if response.status == 200:
                    break
        except (URLError, TimeoutError):
            time.sleep(0.05)
    else:
        process.terminate()
        output, _ = process.communicate(timeout=5)
        pytest.fail(f"Uvicorn did not become ready:\n{output}")

    try:
        yield base_url
    finally:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=5)


def post_json(
    base_url: str,
    payload: dict,
    *,
    token: str | None,
) -> tuple[int, dict]:
    headers = {"Content-Type": "application/json"}
    if token is not None:
        headers["X-Internal-Token"] = token
    request = Request(
        f"{base_url}/receipt/rank",
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with OPENER.open(request, timeout=5) as response:
            return response.status, json.loads(response.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def golden_payload() -> dict:
    return json.loads(FIXTURE.read_text())


def test_live_service_rejects_requests_outside_the_gateway(live_ranker: str) -> None:
    missing_status, _ = post_json(live_ranker, golden_payload(), token=None)
    wrong_status, _ = post_json(live_ranker, golden_payload(), token="wrong")

    assert missing_status == 401
    assert wrong_status == 401


def test_live_service_ranks_without_gemini_or_supabase(live_ranker: str) -> None:
    status, body = post_json(live_ranker, golden_payload(), token=TOKEN)

    assert status == 200
    assert body["rule_version"] == "receipt-v1"
    assert body["as_of_date"] == "2026-10-10"
    assert [
        (result["recipe_id"], result["rank_score"]) for result in body["results"]
    ] == [(101, 3.0), (102, 1.0), (103, 0.0)]


def test_live_service_returns_explainable_validation_errors(live_ranker: str) -> None:
    payload = golden_payload()
    payload["inventory"][0]["quantity"] = -1

    status, body = post_json(live_ranker, payload, token=TOKEN)

    assert status == 422
    assert body["detail"][0]["loc"][-1] == "quantity"
    assert "greater than or equal to 0" in body["detail"][0]["msg"]


def test_live_service_is_repeatable_for_identical_requests(live_ranker: str) -> None:
    first = post_json(live_ranker, golden_payload(), token=TOKEN)
    second = post_json(live_ranker, golden_payload(), token=TOKEN)

    assert first == second

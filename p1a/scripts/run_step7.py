#!/usr/bin/env python3
"""Step 7: run the Qwen local-model generation and capture run evidence.

Reuses the exact shared keeper prompt + context from run_local_model.py, but
writes everything into a timestamped run dir (never touches the committed
response.md) and records: ollama server-log slice, caught errors, GPU snapshots,
and timing/token metadata.
"""
import io
import subprocess
import sys
import traceback
from datetime import datetime
from pathlib import Path

import ollama
from run_local_model import KEEPER_PROMPT, CONTEXT_FILE, MODEL

NUM_CTX = 32768  # qwen2.5:32b hard max
OLLAMA_LOG = Path("/tmp/ollama-serve.log")  # PID 100890 stdout+stderr sink
RUN_DIR = (
    Path(__file__).resolve().parents[1]
    / "prompts" / "qwen2.5" / "runs" / datetime.now().strftime("%Y-%m-%d")
)


class Tee:
    """Mirror writes to the real stream and a log file."""
    def __init__(self, stream, fh):
        self.stream, self.fh = stream, fh

    def write(self, s):
        self.stream.write(s)
        self.fh.write(s)

    def flush(self):
        self.stream.flush()
        self.fh.flush()


def snap_gpu(path):
    try:
        out = subprocess.run(
            ["nvidia-smi"], capture_output=True, text=True, timeout=30
        ).stdout
    except Exception as e:  # nvidia-smi missing / errored — record why
        out = f"nvidia-smi failed: {e}\n"
    path.write_text(out)


def ns_to_s(ns):
    return round((ns or 0) / 1e9, 2)


def main():
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    client_log = (RUN_DIR / "client.log").open("w")
    sys.stdout = Tee(sys.__stdout__, client_log)
    sys.stderr = Tee(sys.__stderr__, client_log)

    errors = RUN_DIR / "caught-errors.log"
    err_lines = []

    context = CONTEXT_FILE.read_text()
    full_prompt = KEEPER_PROMPT + context
    print(f"[step7] run dir: {RUN_DIR}")
    print(f"[step7] model={MODEL} num_ctx={NUM_CTX} "
          f"prompt={len(full_prompt)} chars (~{len(full_prompt)//4} tokens)")

    # 1. mark ollama log position + GPU before
    log_start = OLLAMA_LOG.stat().st_size if OLLAMA_LOG.exists() else 0
    snap_gpu(RUN_DIR / "gpu-before.txt")

    response = None
    try:
        response = ollama.chat(
            model=MODEL,
            messages=[{"role": "user", "content": full_prompt}],
            options={"num_ctx": NUM_CTX, "temperature": 0.3, "num_predict": 16384},
        )
    except Exception:
        tb = traceback.format_exc()
        err_lines.append("=== Exception during ollama.chat ===\n" + tb)
        print(tb, file=sys.stderr)
    finally:
        snap_gpu(RUN_DIR / "gpu-after.txt")
        # 5. slice the server log for this run window
        if OLLAMA_LOG.exists():
            with OLLAMA_LOG.open("rb") as f:
                f.seek(log_start)
                (RUN_DIR / "ollama-serve.log").write_bytes(f.read())
        else:
            (RUN_DIR / "ollama-serve.log").write_text(
                f"{OLLAMA_LOG} not found — ollama serve not logging to a file.\n"
            )
            err_lines.append(f"{OLLAMA_LOG} missing; no server log captured.\n")

    if response is not None:
        output = response["message"]["content"]
        (RUN_DIR / "response.md").write_text(output)

        done = response.get("done_reason")
        if done and done != "stop":
            err_lines.append(
                f"done_reason={done!r} (not 'stop') — output likely truncated "
                f"(num_predict cap or context limit).\n"
            )

        meta = RUN_DIR / "metadata.md"
        meta.write_text(
            "# Step 7 run metadata\n\n"
            f"- timestamp: {datetime.now().isoformat(timespec='seconds')}\n"
            f"- model: {MODEL}\n"
            f"- num_ctx: {NUM_CTX}\n"
            f"- num_predict: 16384, temperature: 0.3\n"
            f"- prompt chars: {len(full_prompt)} (~{len(full_prompt)//4} tokens)\n"
            f"- done_reason: {done}\n"
            f"- prompt_eval_count: {response.get('prompt_eval_count')} tokens\n"
            f"- eval_count: {response.get('eval_count')} tokens\n"
            f"- load_duration: {ns_to_s(response.get('load_duration'))} s\n"
            f"- prompt_eval_duration: {ns_to_s(response.get('prompt_eval_duration'))} s\n"
            f"- eval_duration: {ns_to_s(response.get('eval_duration'))} s\n"
            f"- total_duration: {ns_to_s(response.get('total_duration'))} s\n"
            f"- response.md: {len(output)} chars\n"
        )
        print(f"[step7] response {len(output)} chars, done_reason={done}, "
              f"eval {response.get('eval_count')} tok in "
              f"{ns_to_s(response.get('eval_duration'))}s")

    errors.write_text("".join(err_lines) if err_lines else "No errors caught.\n")
    print(f"[step7] caught-errors: "
          f"{'see caught-errors.log' if err_lines else 'none'}")
    return 1 if response is None else 0


if __name__ == "__main__":
    sys.exit(main())

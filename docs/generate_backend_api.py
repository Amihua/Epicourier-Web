#!/usr/bin/env python3
"""Generate the backend API reference from docstrings, with no third-party tools.

Reads the source with `ast`, so it never imports the modules — which matters here,
because importing anything that reaches api/recommender.py:121 constructs a Gemini
client and fails without a key. A documentation build that cannot run offline is a
documentation build that stops being run.

    python3 docs/generate_backend_api.py          # write docs/api/backend/
    python3 docs/generate_backend_api.py --check  # fail if the output is stale
"""

from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [
    ROOT / "backend" / "api" / "receipt_models.py",
    ROOT / "backend" / "api" / "receipt_scorer.py",
    ROOT / "backend" / "api" / "target_math.py",
]
OUT = ROOT / "docs" / "api" / "backend"


def signature(node: ast.FunctionDef | ast.AsyncFunctionDef) -> str:
    return f"{node.name}({ast.unparse(node.args)})" + (
        f" -> {ast.unparse(node.returns)}" if node.returns else ""
    )


def render(path: Path) -> str:
    tree = ast.parse(path.read_text())
    rel = path.relative_to(ROOT)
    lines = [f"# `{rel}`", ""]

    module_doc = ast.get_docstring(tree)
    if module_doc:
        lines += [module_doc.strip(), ""]

    public = [
        n for n in tree.body
        if isinstance(n, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef))
        and not n.name.startswith("_")
    ]
    if not public:
        lines += ["_No public symbols._", ""]
        return "\n".join(lines)

    lines += ["## Contents", ""]
    for node in public:
        kind = "class" if isinstance(node, ast.ClassDef) else "function"
        lines.append(f"- [`{node.name}`](#{node.name.lower()}) — {kind}")
    lines.append("")

    for node in public:
        doc = (ast.get_docstring(node) or "").strip()
        if isinstance(node, ast.ClassDef):
            lines += [f"## `{node.name}`", "", "**class**", ""]
            if doc:
                lines += [doc, ""]
            fields = [
                f"`{t.target.id}: {ast.unparse(t.annotation)}`"
                for t in node.body
                if isinstance(t, ast.AnnAssign) and isinstance(t.target, ast.Name)
            ]
            if fields:
                lines += ["Fields:", ""] + [f"- {f}" for f in fields] + [""]
            methods = [
                m for m in node.body
                if isinstance(m, (ast.FunctionDef, ast.AsyncFunctionDef)) and not m.name.startswith("_")
            ]
            for m in methods:
                lines += [f"### `{signature(m)}`", ""]
                md = (ast.get_docstring(m) or "").strip()
                if md:
                    lines += [md, ""]
        else:
            lines += [f"## `{node.name}`", "", f"```python\n{signature(node)}\n```", ""]
            if doc:
                lines += [doc, ""]
            else:
                lines += ["_Undocumented._", ""]
    return "\n".join(lines)


def index(pages: list[tuple[str, Path]]) -> str:
    lines = [
        "# Backend API reference",
        "",
        "Generated from source docstrings by `docs/generate_backend_api.py`. Do not edit by hand:",
        "CI regenerates this and fails if it is stale.",
        "",
        "The generator reads the source with `ast` and never imports it, because importing anything",
        "that reaches `api/recommender.py:121` builds a model client and fails without a key.",
        "",
    ]
    for name, path in pages:
        lines.append(f"- [`{name}`]({path.name})")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if the output is stale")
    args = parser.parse_args()

    wanted: dict[Path, str] = {}
    pages: list[tuple[str, Path]] = []
    for src in SOURCES:
        if not src.is_file():
            print(f"missing source: {src}", file=sys.stderr)
            return 2
        target = OUT / (src.stem + ".md")
        wanted[target] = render(src)
        pages.append((src.name, target))
    wanted[OUT / "README.md"] = index(pages)

    if args.check:
        stale = [
            p.relative_to(ROOT) for p, text in wanted.items()
            if not p.is_file() or p.read_text() != text
        ]
        if stale:
            print("stale documentation, re-run docs/generate_backend_api.py:", file=sys.stderr)
            for p in stale:
                print(f"  {p}", file=sys.stderr)
            return 1
        print(f"documentation is current ({len(wanted)} pages)")
        return 0

    OUT.mkdir(parents=True, exist_ok=True)
    for path, text in wanted.items():
        path.write_text(text)
    print(f"wrote {len(wanted)} pages to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

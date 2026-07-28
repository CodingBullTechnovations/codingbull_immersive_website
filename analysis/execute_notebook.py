"""Minimal deterministic notebook executor for this repository's audit notebook.

The bundled workspace Python includes pandas but not the Jupyter command-line
stack. This runner executes code cells sequentially, captures stdout/stderr,
and writes stream or error outputs back into the notebook.
"""

from __future__ import annotations

import contextlib
import io
import json
import sys
import traceback
from pathlib import Path


def main() -> int:
    notebook_path = Path(sys.argv[1])
    notebook = json.loads(notebook_path.read_text())
    namespace: dict[str, object] = {"__name__": "__notebook__"}
    execution_count = 0

    for cell in notebook["cells"]:
        if cell.get("cell_type") != "code":
            continue
        execution_count += 1
        stdout = io.StringIO()
        stderr = io.StringIO()
        cell["execution_count"] = execution_count
        cell["outputs"] = []
        source = "".join(cell.get("source", []))
        try:
            with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
                exec(compile(source, str(notebook_path), "exec"), namespace)
        except Exception as exc:  # noqa: BLE001 - preserve notebook error output
            cell["outputs"].append(
                {
                    "output_type": "error",
                    "ename": type(exc).__name__,
                    "evalue": str(exc),
                    "traceback": traceback.format_exc().splitlines(),
                }
            )
            notebook_path.write_text(json.dumps(notebook, indent=1) + "\n")
            return 1

        if stdout.getvalue():
            cell["outputs"].append(
                {"output_type": "stream", "name": "stdout", "text": stdout.getvalue().splitlines(keepends=True)}
            )
        if stderr.getvalue():
            cell["outputs"].append(
                {"output_type": "stream", "name": "stderr", "text": stderr.getvalue().splitlines(keepends=True)}
            )

    notebook_path.write_text(json.dumps(notebook, indent=1) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

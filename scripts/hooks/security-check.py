#!/usr/bin/env python3
"""PreToolUse hook: blocks dangerous patterns in code being written."""
import sys
import json

DANGEROUS_PATTERNS = [
    "eval(",
    "Function(",
    "innerHTML",
    "document.write(",
    "dangerouslySetInnerHTML",
    "__proto__",
    "constructor.prototype",
    "exec(",
]

SECRET_PATTERNS = [
    "password",
    "secret",
    "api_key",
    "apikey",
    "token",
    "private_key",
    "access_key",
]

def check_content(content: str) -> list:
    issues = []
    for pattern in DANGEROUS_PATTERNS:
        if pattern.lower() in content.lower():
            issues.append(f"Pattern dangereux détecté: {pattern}")

    lines = content.split("\n")
    for i, line in enumerate(lines):
        for pattern in SECRET_PATTERNS:
            if pattern in line.lower() and ("=" in line or ":" in line):
                if "process.env" not in line and "import.meta.env" not in line:
                    if not line.strip().startswith("//") and not line.strip().startswith("#"):
                        if not line.strip().startswith("*"):  # Skip JSDoc
                            issues.append(f"Potentiel secret en dur ligne {i+1}: {pattern}")
    return issues

try:
    data = json.loads(sys.stdin.read())
    tool_input = data.get("tool_input", {})
    content = tool_input.get("file_text", "") or tool_input.get("new_str", "")

    if content:
        issues = check_content(content)
        if issues:
            result = {
                "decision": "deny",
                "reason": "🔒 Problèmes de sécurité détectés:\n" + "\n".join(f"  - {i}" for i in issues)
            }
            print(json.dumps(result))
            sys.exit(2)
except Exception:
    pass  # Don't block on hook errors

sys.exit(0)

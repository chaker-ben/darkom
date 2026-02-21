#!/bin/bash
# PostToolUse hook: auto-format with Prettier after edit
json_input=$(cat)
file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$file_path" ]; then exit 0; fi

# Only format TS/TSX/JS/JSX/JSON/CSS files
if echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx|json|css)$'; then
  if command -v npx &> /dev/null && [ -f "$file_path" ]; then
    npx prettier --write "$file_path" 2>/dev/null
  fi
fi

exit 0

#!/bin/bash
# PostToolUse hook: typecheck + eslint feedback after TS/TSX edit
json_input=$(cat)
file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$file_path" ]; then exit 0; fi

# Only check TS/TSX files
if ! echo "$file_path" | grep -qE '\.(ts|tsx)$'; then exit 0; fi

ISSUES=""

# ESLint check (non-blocking, feedback only)
if command -v npx &> /dev/null && [ -f "$file_path" ]; then
  LINT_OUTPUT=$(npx eslint "$file_path" --no-error-on-unmatched-pattern --format compact 2>&1)
  if [ $? -ne 0 ]; then
    ISSUES="ESLint issues in $file_path: $LINT_OUTPUT"
  fi
fi

# Feed back issues to Claude via additionalContext
if [ -n "$ISSUES" ]; then
  # Escape for JSON
  ESCAPED=$(echo "$ISSUES" | head -c 500 | sed 's/"/\\"/g' | tr '\n' ' ')
  echo "{\"additionalContext\": \"⚠️ $ESCAPED\"}"
fi

exit 0

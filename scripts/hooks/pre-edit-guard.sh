#!/bin/bash
# PreToolUse hook for Edit/Write: blocks writes to sensitive files
json_input=$(cat)
file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$file_path" ]; then
  exit 0
fi

# Block sensitive files
if echo "$file_path" | grep -qE '\.(env|pem|key)$|\.env\.|secrets|credentials'; then
  echo "BLOQUÉ: Fichier sensible: $file_path" >&2
  exit 2
fi

# Block Prisma migration edits (use CLI only)
if echo "$file_path" | grep -qE 'prisma/migrations/'; then
  echo "BLOQUÉ: Ne pas éditer les migrations manuellement. Utiliser 'pnpm db:migrate'." >&2
  exit 2
fi

# Block settings.json edit
if echo "$file_path" | grep -qE '\.claude/settings\.json$'; then
  echo "BLOQUÉ: Ne pas modifier settings.json programmatiquement." >&2
  exit 2
fi

exit 0

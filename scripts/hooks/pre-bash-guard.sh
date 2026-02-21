#!/bin/bash
# PreToolUse hook for Bash: blocks dangerous commands
json_input=$(cat)
cmd=$(echo "$json_input" | jq -r '.tool_input.command // empty')

if [ -z "$cmd" ]; then
  exit 0
fi

# Block destructive patterns
if echo "$cmd" | grep -qE '(rm\s+-rf\s+[/~]|chmod\s+777|>\s*/dev/sd|mkfs\.|dd\s+if=)'; then
  echo "BLOQUÉ: Commande destructrice détectée: $cmd" >&2
  exit 2
fi

# Block secret exposure
if echo "$cmd" | grep -qE '(cat\s+\.env|echo\s+\$.*SECRET|echo\s+\$.*PASSWORD|echo\s+\$.*TOKEN|echo\s+\$.*API_KEY)'; then
  echo "BLOQUÉ: Tentative d'exposition de secrets: $cmd" >&2
  exit 2
fi

exit 0

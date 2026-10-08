#!/bin/sh
# Writes federation.manifest.json from environment variables at container start, so the *same* shell image
# can point at different remote URLs per environment – no rebuild needed when a remote moves.
#
#   MFE_REMOTE_MFE_ORDERING=https://ordering.example.com/remoteEntry.json  ->  "mfe-ordering": "https://ordering..."
#
# Only runs when at least one MFE_REMOTE_* variable is set (i.e. in the shell container).
set -eu

MANIFEST=/usr/share/nginx/html/federation.manifest.json
VARS=$(env | grep '^MFE_REMOTE_' | sort || true)
[ -z "$VARS" ] && exit 0

{
  echo "{"
  first=true
  echo "$VARS" | while IFS='=' read -r key value; do
    name=$(echo "${key#MFE_REMOTE_}" | tr 'A-Z_' 'a-z-')
    $first || printf ",\n"
    printf '  "%s": "%s"' "$name" "$value"
    first=false
  done
  echo ""
  echo "}"
} > "$MANIFEST"

echo "federation.manifest.json:"
cat "$MANIFEST"

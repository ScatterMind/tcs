#!/usr/bin/env bash
# Build the deployable subset of this repo into dist/.
#
# Reads an explicit allowlist below. Only items listed here end up
# in dist/ and get published by the deploy workflows. Everything
# else (notes/, corpus/, HANDOFF.md, scripts/, ...) stays out.
#
# WARNING: each allowlist entry deploys RECURSIVELY. Everything
# under an allowlisted directory is published. Don't drop sensitive
# files inside an allowlisted dir — they belong in notes/ or
# corpus/ instead. See HANDOFF "Do not publish" for the bar.
#
# Usage:
#   scripts/build-dist.sh [dist-dir]

set -euo pipefail

# allowlist entries: "source-path:dest-path"
# source-path is relative to repo root; dest-path is relative to dist root
ALLOWLIST=(
  "site/drills:drills"
)

DIST="${1:-dist}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

rm -rf "$DIST"
mkdir -p "$DIST"

copied=0
for entry in "${ALLOWLIST[@]}"; do
  src="${entry%%:*}"
  dest="${entry#*:}"
  if [ ! -e "$src" ]; then
    echo "warn: allowlist entry missing: $src" >&2
    continue
  fi
  mkdir -p "$DIST/$(dirname "$dest")"
  cp -r "$src" "$DIST/$dest"
  echo "  $src -> $DIST/$dest"
  copied=$((copied + 1))
done

filecount=$(find "$DIST" -type f | wc -l | tr -d ' ')
echo "built $DIST ($copied entries, $filecount files)"

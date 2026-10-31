#!/usr/bin/env bash
# Ejecuta `npm test` en cada paquete (instala dependencias si faltan).
set -e
cd "$(dirname "$0")/.."
for dir in servicios/auth servicios/productos servicios/notificaciones gateway frontend; do
  echo "=== $dir ==="
  (cd "$dir" && { [ -d node_modules ] || npm install --no-audit --no-fund; } && npm test)
done

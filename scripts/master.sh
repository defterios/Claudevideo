#!/usr/bin/env bash
# Final mastering pass: brick-wall limiter + loudness to -12 LUFS / -1 dBTP (video stream copied untouched).
set -euo pipefail
in="$1"; out="$2"
ffmpeg -y -i "$in" -c:v copy -af "alimiter=limit=0.84:attack=1:release=60:level=disabled,loudnorm=I=-12:TP=-1.5:LRA=7,alimiter=limit=0.86:attack=0.5:release=40:level=disabled" -ar 48000 -c:a aac -b:a 256k "$out"

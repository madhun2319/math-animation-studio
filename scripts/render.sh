#!/usr/bin/env bash
# Render the Surface of Revolution animation
# Usage: ./scripts/render.sh [quick|preview|hd|4k]

QUALITY="${1:-preview}"
SCENE_FILE="scenes/curve_rotation_3d.py"

case "$QUALITY" in
    quick)   manim -pql "$SCENE_FILE" QuickPreview ;;
    preview) manim -pqh "$SCENE_FILE" SurfaceOfRevolution ;;
    hd)      manim -qh  "$SCENE_FILE" SurfaceOfRevolution ;;
    4k)      manim -pqk "$SCENE_FILE" SurfaceOfRevolution ;;
    *)       echo "Usage: $0 [quick|preview|hd|4k]" ; exit 1 ;;
esac

# Render the Surface of Revolution animation
param(
    [ValidateSet("preview","hd","4k","quick")]
    [string]$Quality = "preview"
)

$sceneFile = "scenes/curve_rotation_3d.py"

switch ($Quality) {
    "quick"   { manim -pql $sceneFile QuickPreview }
    "preview" { manim -pqh $sceneFile SurfaceOfRevolution }
    "hd"      { manim -qh  $sceneFile SurfaceOfRevolution }
    "4k"      { manim -pqk $sceneFile SurfaceOfRevolution }
}

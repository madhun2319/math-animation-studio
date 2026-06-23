# Math Animation Studio

A Manim-based math animation pipeline, Codespaces-ready. Build 3Blue1Brown-style mathematical animations — surfaces of revolution, physics simulations, chemical visualizations.

## Quick Start

```bash
# Codespaces: open this repo → everything installs automatically
# Local:    pip install -r requirements.txt

# Render the surface-of-revolution animation:
manim -pqh scenes/curve_rotation_3d.py SurfaceOfRevolution

# Quick low-res preview (fast iteration):
manim -pql scenes/curve_rotation_3d.py QuickPreview
```

## Project Structure

```
scenes/           → Manim animation scripts
  curve_rotation_3d.py   → Surface of revolution (3D curve rotation)
media/            → rendered output (gitignored)
requirements.txt  → Python deps
MATH_ANIMATION_TOOLKIT.md → curated repo/MCP reference atlas
```

## Manim Conventions

- **Scenes per file:** One primary scene + optional `QuickPreview` variant
- **Config in-file:** `config.pixel_height`, `config.frame_rate` at module top
- **Naming:** `CamelCaseSceneName` for scenes, `snake_case.py` for files
- **Preview first:** Always render `QuickPreview` before the full scene to verify
- **Quality flags:**
  - `-pql` — 480p preview (fast)
  - `-pqh` — 1080p preview
  - `-qh`  — 1080p final render
  - `-pqk` — 4K preview

## Math Functions as Manim Surfaces

Surface of revolution pattern — revolve `f(x)` around x-axis:

```python
def surface_of_revolution(u, v):
    r = f(u)
    return np.array([u, r * np.cos(v), r * np.sin(v)])

surface = Surface(
    lambda u, v: surface_of_revolution(u, v),
    u_range=[0, TAU], v_range=[0, TAU],
    resolution=(80, 48),
)
```

## Key MCP Servers (from MATH_ANIMATION_TOOLKIT.md)

| Server | Use |
|--------|-----|
| Manim MCP (Stelath) | Claude → Manim script → MP4 video |
| mcp-server-jsxgraph | Quick interactive previews (no render) |
| IBM/chuk-mcp-physics | Physics calculations (55 tools) |
| chemdraw-mcp | Chemical structure diagrams |

## Key Repos

| Repo | Stars | Purpose |
|------|-------|---------|
| 3b1b/manim | 81k | Grant Sanderson's original engine (ManimGL) |
| ManimCommunity/manim | 39k | Stable community fork — **this project uses this** |
| adithya-s-k/manim_skill | 931 | AI agent skills for Manim (`npx skills add`) |
| Matheart/manim-physics | — | Physics plugin for Manim |
| manim-chemistry | — | Chemistry plugin for Manim |

## Physics MCP Quick Ref

```bash
uvx chuk-mcp-physics           # IBM Rapier-based physics (55 tools)
pip install psianimator-mcp    # Quantum physics (Bloch sphere, Wigner)
```

## Chemistry MCP Quick Ref

```bash
npx -y molterm-mcp             # Protein structure rendering
npx -y chemdraw-mcp            # Molecule → 2D/3D structure
npm install -g chemcp          # SMILES → 2D diagram viewer
```

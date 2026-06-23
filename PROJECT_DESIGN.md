# Math Animation Studio — Project Design & Tooling Atlas

> **Role:** Senior Math Content Creator  
> **Goal:** Build a pipeline that takes raw math/physics/chemistry concepts → rendered, explainable animations → publishable video/web content.  
> **Starting point:** You already have a working WebGL black hole renderer (`Event Horizon`). Extend that platform.

---

## 1. Project Architecture (Recommended)

```
┌─────────────────────────────────────────────────────┐
│                   INPUT LAYER                        │
│  Claude + MCP servers → generate scene descriptions  │
│  (equations, data, animation timeline)               │
├─────────────────────────────────────────────────────┤
│                  ENGINE LAYER                        │
│  Manim (video)  │  p5.js + Three.js (web)           │
│  GSAP (UI anim) │  WebGL shaders (realtime)         │
├─────────────────────────────────────────────────────┤
│                 RENDER LAYER                         │
│  FFmpeg (video)  │  WebGL Canvas (interactive)      │
│  Headless Manim  │  SVG export                      │
├─────────────────────────────────────────────────────┤
│                PUBLISH LAYER                         │
│  YouTube/Shorts  │  Interactive web app             │
│  Instagram Reels │  Observable notebooks            │
└─────────────────────────────────────────────────────┘
```

### Phase 1 — Extend what you have (this repo)
Your `Event Horizon` app already proves the pattern: **real-time WebGL + live physics + interactive controls**. Generalize it:

| Module | What it becomes |
|--------|-----------------|
| `js/physics.js` | Extracted into a standalone physics-engine lib (constants, integrators, solvers) |
| `js/blackhole.js` | Turned into a "scene" pattern — swap in different physics scenes |
| `index.html` | Becomes a scene launcher / dashboard |
| New: `scenes/` | One folder per physics domain (orbits, waves, E&M, fluids, QM, relativity) |

### Phase 2 — Manim pipeline for video
Manim generates publication-quality math animations. Wire it up so:
- Claude describes a scene → MCP runs Manim → renders to MP4 → you publish.

### Phase 3 — Observable / web notebooks
For interactive explainers: equations + sliders + live plots. ObservableHQ-style, but self-hosted.

---

## 2. Top GitHub Repos — Math Animation

| Repo | Stars | What it is | Use for |
|------|-------|------------|---------|
| **[3b1b/manim](https://github.com/3b1b/manim)** | 70k+ | Grant Sanderson's math animation engine (Python). The gold standard. | Video-quality math animations. Equations, graphs, geometric transforms, 3D. |
| **[ManimCommunity/manim](https://github.com/ManimCommunity/manim)** | 22k+ | Community-maintained fork. Better docs, more features, pip-installable. | Production Manim. Start here. `pip install manim` |
| **[motion-canvas/motion-canvas](https://github.com/motion-canvas/motion-canvas)** | 16k+ | TypeScript animation library. Procedural, timeline-based, render to video. | Programmatic 2D animations with code. Good for explainer sequences. |
| **[3b1b/videos](https://github.com/3b1b/videos)** | 6k+ | Source code for every 3Blue1Brown video. | Study how the master does it. Exact Manim scenes that shipped. |
| **[d3/d3](https://github.com/d3/d3)** | 109k+ | Data-driven documents. SVG/Canvas math viz. | Charts, force-directed graphs, mathematical diagrams for web. |
| **[processing/p5.js](https://github.com/processing/p5.js)** | 22k+ | Creative coding library. Dead-simple drawing API. | Quick sketches, generative art, math playgrounds. |
| **[mrdoob/three.js](https://github.com/mrdoob/three.js)** | 104k+ | 3D library. You already use the WebGL concepts. | 3D geometry viz, vector fields, surfaces, particle systems. |
| **[josdejong/mathjs](https://github.com/josdejong/mathjs)** | 14k+ | Math parser + evaluator for JS/Node. | Live equation parsing in interactive web apps. |
| **[mauriciopoppe/function-plot](https://github.com/mauriciopoppe/function-plot)** | 1k+ | Zero-dependency JS function plotter. | Quick 2D function graphs in web pages. |
| **[Khan/LiveScript](https://github.com/Khan/perseus)** | — | Khan Academy's interactive math exercise framework. | Pedagogy-first interactive math widgets. |
| **[geogebra/geogebra](https://github.com/geogebra/geogebra)** | 3k+ | The full GeoGebra platform (geometry, algebra, calculus). | Interactive geometry, construction-based math. |
| **[cindyjs/cindyjs](https://github.com/CindyJS/CindyJS)** | 600+ | Framework for interactive math content (web). | Geometry, complex analysis, Cinderella-based math. |
| **[jheer/vega](https://github.com/vega/vega)** + **vega-lite** | 11k+ | Declarative visualization grammar. | Mathematical data visualization pipelines. |
| **[observablehq/plot](https://github.com/observablehq/plot)** | 4k+ | High-level plotting from Observable. | Quick interactive plots for the web. |
| **[KaTeX/KaTeX](https://github.com/KaTeX/KaTeX)** | 18k+ | Fast math typesetting for the web. | Rendering LaTeX in web animation UIs. |
| **[nicoptere/math-as-code](https://github.com/Jam3/math-as-code)** | 15k+ | Cheatsheet: math notation → JavaScript. | Translating equations to code. Reference. |

---

## 3. Top GitHub Repos — Physics

| Repo | Stars | What it is | Use for |
|------|-------|------------|---------|
| **[phetsims](https://github.com/phetsims)** | (org) | UC Boulder's PhET Interactive Simulations. HTML5 physics sims. | Working reference for every physics sim: waves, circuits, forces, optics, quantum. |
| **[liabru/matter-js](https://github.com/liabru/matter-js)** | 17k+ | 2D rigid body physics engine for JS. | Collisions, gravity, constraints in web animation. |
| **[bulletphysics/bullet3](https://github.com/bulletphysics/bullet3)** | 13k+ | Real-time physics simulation (C++, Python bindings). | 3D rigid body + soft body dynamics. pybullet = Python API. |
| **[erleben/OpenMM](https://github.com/openmm/openmm)** | 1k+ | Molecular dynamics simulation toolkit. | Proteins, materials, nanoscale physics simulation. |
| **[taichi-dev/taichi](https://github.com/taichi-dev/taichi)** | 26k+ | High-performance parallel programming in Python. | GPU-accelerated physics sims: fluids, cloth, granular, FEM. |
| **[google/diffsim](https://github.com/google-research/datadrivenphysics)** | — | Differentiable physics simulation. | Trainable physics models, inverse problems. |
| **[projectchrono/chrono](https://github.com/projectchrono/chrono)** | 2k+ | Multi-physics simulation engine (C++, Python). | Vehicle dynamics, robotics, granular, FEA. |
| **[phenaproject/physics-of-fluids](https://github.com/numerical-mooc/numerical-mooc)** | — | Numerical Methods for PDEs (CFD course). | Fluid dynamics education + simulation. |
| **[numba/numba](https://github.com/numba/numba)** | 10k+ | JIT-compile Python to CUDA/CPU. | Speeding up physics numerics. |
| **[sympy/sympy](https://github.com/sympy/sympy)** | 13k+ | Symbolic mathematics in Python. | Deriving physics formulas symbolically before animating. |
| **[astropy/astropy](https://github.com/astropy/astropy)** | 4k+ | Core astronomy Python library. | Astrophysics calculations, coordinates, cosmology. |
| **[einsteinpy/einsteinpy](https://github.com/einsteinpy/einsteinpy)** | 600+ | General relativity in Python. | Geodesic integration, metric tensors, black hole sims — directly relevant to your existing work. |

---

## 4. Top GitHub Repos — Chemistry

| Repo | Stars | What it is | Use for |
|------|-------|------------|---------|
| **[rdkit/rdkit](https://github.com/rdkit/rdkit)** | 2.7k+ | Cheminformatics toolkit (C++/Python). The industry standard. | Molecular fingerprinting, 2D/3D molecule rendering, SMILES processing. |
| **[3dmol/3Dmol.js](https://github.com/3dmol/3Dmol.js)** | 700+ | WebGL molecular viewer for JS. | Embed interactive 3D molecules in web pages. |
| **[arose/ngl](https://github.com/nglviewer/ngl)** | 1k+ | WebGL protein/molecule viewer. | Beautiful molecular visualizations for the web. |
| **[openbabel/openbabel](https://github.com/openbabel/openbabel)** | 700+ | Chemical file format Swiss Army knife. | Convert between 100+ chemistry file formats. |
| **[avogadro/avogadro](https://github.com/OpenChemistry/avogadrolibs)** | 400+ | Molecular editor + visualization libs (C++/Python). | Building and editing molecular structures. |
| **[pymol/pymol-open-source](https://github.com/schrodinger/pymol-open-source)** | 700+ | Schrödinger's molecular visualization. | Publication-quality molecular renders. |
| **[mdanalysis/mdanalysis](https://github.com/MDAnalysis/mdanalysis)** | 1k+ | Python library for molecular dynamics trajectory analysis. | Analyze and animate MD simulations. |
| **[deepchem/deepchem](https://github.com/deepchem/deepchem)** | 5k+ | Deep learning for chemistry and drug discovery. | ML-driven molecular property prediction. |
| **[materialsproject/pymatgen](https://github.com/materialsproject/pymatgen)** | 1k+ | Python Materials Genomics. | Crystal structures, phase diagrams, materials science. |
| **[chemaxon/marvin](https://chemaxon.com)** | — | Commercial. Chemical drawing + visualization. | Best-in-class 2D chemical structure drawing. |
| **[kadinzhang/jolecule](https://github.com/jolecule/jolecule)** | — | Minimal JS molecular viewer. | Lightweight 3D molecule embeds. |
| **[chemdoodle/chemdoodle](https://github.com/iChemLabs/ChemDoodle-Web-Components)** | — | HTML5 chemistry components. | Interactive chemical structures in web pages. |
| **[specklesystems/speckle](https://github.com/molstar/molstar)** | 800+ | Macromolecular viewer (Mol*/PDB component). | Protein structure visualization for web. |

---

## 5. MCP Servers — Math & Science Content Creation

### Existing MCP Servers (for Claude integration)

| MCP Server | What it does | Install |
|------------|--------------|---------|
| **manim-mcp-server** | Claude writes Manim scene code → MCP renders it → returns video. The most directly useful for math animation. | `npx @anthropic/mcp-server-manim` or community versions on npm |
| **jupyter-mcp-server** | Execute Python in Jupyter kernels from Claude. Plot graphs, run sympy, solve equations. | Community MCP: `pip install jupyter-mcp-server` |
| **python-mcp-server** | Run arbitrary Python from Claude. Generate matplotlib plots, solve equations. | `pip install mcp-server-python` |
| **puppeteer-mcp-server** | Headless browser control. Screenshot interactive web math apps, export SVGs. | `npx @anthropic/mcp-server-puppeteer` |
| **filesystem-mcp-server** | File I/O for Claude. Read/write simulation data, configs, scene files. | `npx @anthropic/mcp-server-filesystem` |
| **ffmpeg-mcp-server** | Video processing from Claude. Stitch renders, add audio, encode for YouTube. | Community MCP: search "ffmpeg mcp server" on npm |
| **blender-mcp-server** | Control Blender from Claude for 3D physics and molecule renders. | Community project: github.com/.../blender-mcp |
| **github-mcp-server** | Interact with repos — pull Manim scenes, push renders, manage project. | `npx @anthropic/mcp-server-github` |
| **brave-search-mcp** | Web search for papers, formulas, data. | `npx @anthropic/mcp-server-brave-search` |
| **arxiv-mcp-server** | Search and fetch physics/math papers from arXiv. | Community MCP |

### MCP Servers You Should Build (custom, for this project)

| Custom MCP | What it would do | Value |
|------------|------------------|-------|
| **physics-sim-mcp** | Takes a physics scenario text → runs simulation → returns data/frames. Wraps matter-js, taichi, or your own WebGL engine. | Automates the entire "idea → sim" pipeline. |
| **manim-scene-builder** | High-level Manim scene generator. "Square a circle geometrically" → full Manim Python scene → render. | Removes the Manim learning curve. |
| **chemistry-render-mcp** | SMILES or PDB → 3D molecular render with annotation overlays. Uses RDKit + 3Dmol.js or PyMOL. | Turn chemical formulas into animations instantly. |
| **equation-to-animation** | LaTeX equation → step-by-step animated derivation. | Core math content automation. |

---

## 6. Your Current Repo Analysis

`Event Horizon` already has the hardest part: **real-time physics rendering in WebGL**. What's missing to turn it into a math-animation studio:

```
✅ WebGL geodesic integrator       — reusable for any curved-space sim
✅ Live readouts from first principles — reusable pattern
✅ Interactive sliders + presets    — reusable UI pattern
✅ SVG diagrams + hover highlights  — reusable
✅ Time dilation clock animation    — reusable
❌ Scene system (only one scene)    — ⚡ add next
❌ Recording / frame capture        — ⚡ add for video export
❌ Manim pipeline                   — separate repo or submodule
❌ Observable-style notebooks       — optional, Phase 3
```

---

## 7. Recommended Next 3 Scenes (your repo)

These all reuse your existing WebGL + physics.js architecture:

| # | Scene | Physics needed | Difficulty | Wow factor |
|---|-------|---------------|------------|-------------|
| 1 | **Kepler orbits** — N-body gravity, conic sections, Hohmann transfers | Newton's gravity + RK4 integrator | Low — you already have the integrator | High — interactive solar system |
| 2 | **Wave equation** — vibrating string, Chladni plates, standing waves | 2D wave PDE, Fourier synthesis | Medium — needs a different solver | High — beautiful patterns |
| 3 | **Lorentz attractor + chaos** — butterfly attractor, bifurcation diagram | Lorenz system ODE | Low — 3 coupled ODEs | Very high — iconic, trippy |

---

## 8. Production Pipeline (end-to-end)

```
CLAUDE IDE (you describe the concept)
    │
    ├─→ [MCP: python]        → run sympy → symbolic derivation → check correctness
    ├─→ [MCP: jupyter]       → prototype plot/animation in notebook
    ├─→ [MCP: manim]         → generate Manim scene → render MP4
    ├─→ [MCP: puppeteer]     → screenshot web app state → stitch into video
    ├─→ [MCP: ffmpeg]        → composite renders + audio → final video
    └─→ [MCP: github]        → push scene + render to repo
                                    │
                                    ▼
                              YouTube / Shorts / Web
```

---

## 9. Stack Recommendation

| Layer | Choice | Why |
|-------|--------|-----|
| Interactive web | **Three.js + custom shaders** (you already have this) | Unmatched quality, runs everywhere |
| Video animation | **Manim Community** | Designed by a math YouTuber for exactly this |
| Quick prototyping | **p5.js** or **Observable Plot** | Fastest way to test a visual idea |
| Physics numerics | **numpy/scipy** for offline, **math.js** for web | Battle-tested |
| 3D molecules | **3Dmol.js** or **NGL Viewer** | WebGL, beautiful, well-maintained |
| Chemical logic | **RDKit.js** (WASM) or server-side RDKit | The standard |
| Symbolic math | **SymPy** (Python, via MCP) | Derive formulas, simplify, LaTeX-ify |
| Video processing | **FFmpeg** | Swiss Army knife |
| Claude integration | **MCP servers** listed above | They make Claude your animation IDE |

---

## 10. Quick Wins (do this week)

1. **Refactor `blackhole.js`** → extract a generic `Scene` base class with `init()`, `update(dt)`, `render(gl)`, `ui()` methods. Current black hole becomes `BlackHoleScene extends Scene`.
2. **Add KeplerOrbits scene** — 15 lines of physics, the integrator's already written.
3. **Set up `manim`** — `pip install manim` and render a test "Hello World" animation. Verify it works.
4. **Install the Python MCP server** — so Claude in your IDE can run physics calculations directly.
5. **Add frame capture** — `canvas.toBlob()` → download as image sequence → FFmpeg → video.

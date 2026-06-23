# 🎬 Math Animation — Content Creation Master List

> Curated June 2026. Top GitHub repos + MCP servers for math, physics, and chemistry content creation.

---

# 🎬 MATH ANIMATION

## Top GitHub Repos (Ranked by Stars/Relevance)

### Tier 1 — The Engines

| Repo | Stars | What It Is |
|------|-------|------------|
| **[3b1b/manim](https://github.com/3b1b/manim)** (ManimGL) | **~81k** | Grant Sanderson's original engine. OpenGL 3D, interactive mode, experimental features. Powers every 3Blue1Brown video. |
| **[ManimCommunity/manim](https://github.com/ManimCommunity/manim)** | **~39k** | Community fork — stable, well-tested, beginner-friendly. The one most people should start with. |

### Tier 2 — Plugins & Extensions

| Repo | Stars | What It Is |
|------|-------|------------|
| **[ManimCommunity/manim-voiceover](https://github.com/ManimCommunity/manim-voiceover)** | ~301 | Auto-narrated voiceover plugin (Azure, AWS Polly, gTTS, etc.) |
| **[ManimCommunity/manim_editor](https://github.com/ManimCommunity/manim_editor)** | ~358 | Web-based GUI presenter for Manim animations |
| **[jeertmans/manim-slides](https://github.com/jeertmans/manim-slides)** | — | Live presentation tool using Manim scenes as slides |
| **[ManimCommunity/DiscordManimator](https://github.com/ManimCommunity/DiscordManimator)** | — | Discord bot — type a command, get a rendered Manim video back |

### Tier 3 — AI-Agent Skills (2025–2026 Hotness)

| Repo | Stars | What It Is |
|------|-------|------------|
| **[adithya-s-k/manim_skill](https://github.com/adithya-s-k/manim_skill)** | **~931** | Agent skills pack for Claude Code / Cursor / Copilot. Battle-tested patterns for both ManimCE & ManimGL. Install: `npx skills add adithya-s-k/manim_skill` |
| **[Science-Prof-Robot/recursive-math-animator](https://github.com/Science-Prof-Robot/recursive-math-animator)** | New | 9 ready-made animation patterns (bar charts, pie charts, formula derivations). No LaTeX required. Auto voiceover + SRT. Git-based versioning. |
| **[Wing900/ManimCat](https://github.com/Wing900/ManimCat)** | New | Natural language → math video. React frontend + TypeScript backend. Dual mode: fast workflow or iterative agent studio. |

### Tier 4 — Zero-Code / Config-Driven

| Repo | Stars | What It Is |
|------|-------|------------|
| **[ebowwa/simulationapi](https://github.com/ebowwa/simulationapi)** (Manim Studio) | — | YAML/JSON → animation. 100+ effects. MCP AI interface. Goal: "mathematical metaverse." |

### Tier 5 — Alternatives to Manim

| Repo | What It Is |
|------|------------|
| **[gmanim](https://github.com/gmanim)** | Grammar of mathematical animation for **R** — 3Blue1Brown-style visuals using tidyverse R code |
| **[mathlikeanim-rs](https://pypi.org/project/mathlikeanim-rs/)** | Rust-powered animation engine with Python bindings. Faster render times. |
| **[janim](https://pypi.org/project/janim/)** | Modern alternative, GPU-accelerated, simpler API |
| **[Giraphics](https://github.com/girirajhira/Giraphics)** | Lightweight graphing + animation, minimal dependencies |

---

## Top MCP Servers for Math Animation

| Server | Install | What It Does |
|--------|---------|--------------|
| **[Manim MCP by Stelath](https://glama.ai/mcp/servers/Stelath/manim-mcp)** | One-click `.mcpb` bundle | Claude writes Manim Python code → gets MP4 video back. Quality presets (480p–1080p), example templates. **~12k downloads** |
| **[Manim MCP by abhiemj](https://mcp.aibase.com/server/1916354800080887809)** | MCP config entry | Script execution → video output, Claude integration. **~10k downloads** |
| **[mcp-server-jsxgraph](https://www.npmjs.com/package/mcp-server-jsxgraph)** | `npx -y mcp-server-jsxgraph` | **13 tools** — interactive function graphs, parametric curves, geometry, vector fields, conic sections, polynomial analysis. Outputs browser-ready HTML/SVG. No video render needed. |
| **[math-canvas-mcp](https://socket.dev/npm/package/math-canvas-mcp)** | npm install | Simple geometry plotting → public image URL. One `plot` tool, zero config. |
| **[mathematica-mcp-full](https://pypi.org/project/mathematica-mcp-full/)** | `pip install mathematica-mcp-full` | **82 tools** — full Wolfram Mathematica kernel via MCP. Symbolic + numeric computation, 2D/3D plots, Manipulate sliders, notebook screenshots. Requires Mathematica license. |

---

# ⚛️ PHYSICS

## Top GitHub Repos

### Simulation & Animation Engines

| Repo | What It Is |
|------|------------|
| **[Matheart/manim-physics](https://github.com/Matheart/manim-physics)** | Manim plugin for physics simulations — mechanics, waves, E&M, optics. Renders as 3Blue1Brown-style animated video. |
| **[Damien3008/N-bodies-problem](https://github.com/Damien3008/N-bodies-problem)** | Interactive 3D N-body gravitational sim. Real NASA planetary data. Euler/RK2/RK4/Verlet/Adams-Bashforth integrators. Plotly/Dash visualization. |
| **[LuceilIsRight/N-Body-Orbital-Dynamics](https://github.com/LuceilIsRight/N-Body-Orbital-Dynamics)** | N-body using **REBOUND** astrophysics package. 50+ particles, WHFast symplectic integrator, MP4 output via FFmpeg. |
| **[suwarna-wave/Project-Collision](https://github.com/suwarna-wave/Project-Collision)** | Real-time 2D collision physics engine. Elastic/inelastic modes, live momentum/energy charts. Pygame + matplotlib. |
| **[physical_simulations](https://explore.market.dev/ecosystems/pytorch/projects/physical_simulations)** (market.dev) | Brownian motion, Metropolis-Hastings, RK4, finite differences, Snell's law optics (GIF output), DFT toy model. PyTorch integration. |
| **[SKCH-GE/PlanetSIMPy](https://github.com/SKCH-GE/PlanetSIMPy)** | Solar system sim. Accurate gravity, orbit trails. Built with Pygame. Beginner-friendly. |

### Massive Educational Libraries

| Repo | What It Is |
|------|------------|
| **[zombimann/Mathematical-video-animations-and-visualization](https://github.com/zombimann/Mathematical-video-animations-and-visualization)** | **200+ commits**. Free educational animations: QED, QCD, Higgs mechanism, General Relativity, fluid dynamics, Feynman path integrals, PID/LQR/MPC control. All Jupyter Notebooks. |

## Top MCP Servers for Physics

| Server | Install | What It Does |
|--------|---------|--------------|
| **[IBM/chuk-mcp-physics](https://github.com/IBM/chuk-mcp-physics)** | `uvx chuk-mcp-physics` | **55 tools**, 10 categories. Classical mechanics, fluid dynamics, rotational motion, oscillations, kinematics, collisions, rigid-body sim (Rapier engine). Magnus force, wind, altitude, temperature effects. 515 tests. |
| **[chuk-mcp-stage](https://pypi.org/project/chuk-mcp-stage/)** | pip install | Bridges physics sim output → React Three Fiber, Remotion, glTF. Scene graphs, camera paths, animation baking. |
| **[bullet-mcp-server](https://github.com/devgabrielsborges/bullet-mcp-server)** | MCP config | Full PyBullet 3D physics via MCP. Create simulations, load URDF/primitive objects, apply forces, step sim. GUI or headless. |
| **[PsiAnimator-MCP](https://lobehub.com/ru/mcp/manasp21-psianimator-mcp)** | `pip install psianimator-mcp` | Quantum physics visualization. Bloch sphere, Wigner functions, state tomography, quantum circuits. QuTip + Manim. |
| **[omni-mcp/isaac-sim-mcp](https://github.com/omni-mcp/isaac-sim-mcp)** | pip install | NVIDIA Isaac Sim via MCP. Robot spawning, physics scenes, arbitrary Python execution. |

### Game-Engine MCPs with Physics

| Server | What It Does |
|--------|--------------|
| **[Unity-MCP-Vibe](https://github.com/jlceaser/Unity-MCP-Vibe)** | 110+ tools. Native C# in Unity memory. Physics bodies, rigid-body control, collisions, raycasting. |
| **[Unreal_mcp](https://github.com/chir24/unreal_mcp)** | Unreal Engine 5. Ragdolls, vehicles, constraints, Chaos cloth, Niagara particles. |
| **[Godot MCP](https://github.com/tugcantopaloglu/godot-mcp)** | 149 tools for Godot 4.x. Physics bodies, joints (pin/spring/hinge/cone/slider), raycasts. |

---

# 🧪 CHEMISTRY

## Top GitHub Repos

### Molecular Visualization & Editing

| Repo | Stars | What It Is |
|------|-------|------------|
| **[OpenChemistry/avogadrolibs](https://github.com/OpenChemistry/avogadrolibs)** (Avogadro 2) | **~538** | Industry-standard open-source molecular editor. 20+ plugins, ML potentials, AM1-BCC charges, fast UFF optimization (10× faster on large molecules). C++/Qt5/OpenGL. |
| **[VTX-Molecular-Visualization](https://github.com/VTX-Molecular-Visualization)** | — | Real-time meshless molecular rendering. Handles **100M+ atoms** on a laptop. Cinematic rendering (ambient occlusion, toon shading, outline). 8K export. |
| **[MolCrafts/molvis](https://github.com/MolCrafts/molvis)** | — | Web-first (React 19, Babylon.js, WebGL). Works in browser, VSCode, and Jupyter. Reversible command system, modifier pipelines, RDF/MSD/clustering analysis. |
| **[uibcdf/molsysviewer](https://github.com/uibcdf/molsysviewer)** | — | Jupyter-native 3D viewer. Pythonic scene management, pharmacophore glyphs, H-bond overlays, trajectory playback. Every action exportable as reproducible Python. |
| **[David-OConnor/molchanica](https://github.com/David-OConnor/molchanica)** | — | All-in-one Rust app: molecule viewer + editor + MD simulator. Amber force fields, OPC water, SPME Coulomb, ORCA integration, CADD tools. |

### Chemistry + Manim

| Repo | What It Is |
|------|------------|
| **[manim-chemistry](https://packages.ecosyste.ms/registries/pypi.org/packages/manim-chemistry)** (UnMolDeQuimica) | Manim plugin for chemistry visualizations — molecular structures, reactions, orbitals. |

### Simulation Workflow Platforms

| Repo | What It Is |
|------|------------|
| **[molssi-seamm/seamm](https://github.com/molssi-seamm/seamm)** | Graphical flowchart-based simulation environment. Multi-code (LAMMPS, ORCA). Full metadata + reproducibility. Laptop → HPC. |
| **atomes** (from hal.science) | 3D atomic-scale model builder. Ring/chain statistics, Q_l, RDF/structure factors, 230 space groups, NPT trajectory analysis. C/Fortran/GLSL. |

## Top MCP Servers for Chemistry

| Server | Install | What It Does |
|--------|---------|--------------|
| **[ChemLint](https://github.com/molML/ChemLint)** | MCP config | **150+ tools**. SMILES standardization, 33 ML algorithms for property prediction, scaffold analysis, PCA/t-SNE visualization, full audit trail. TU Eindhoven. |
| **[chemdraw-mcp](https://github.com/jurimaxam-dotcom/chemdraw-mcp)** | MCP config | Name/SMILES → publication-quality 2D structures (PNG/SVG/CDXML). Reaction schemes, curved-arrow mechanisms, 3D ball-and-stick, schematic IR/NMR spectra, Lipinski Rule-of-Five. Apache 2.0. |
| **[molterm-mcp](https://www.npmjs.com/package/molterm-mcp)** | `npx -y molterm-mcp` | Protein structure rendering, interatomic measurements, structural alignment (TM-score/RMSD), secondary structure (DSSP), PNG screenshots. |
| **[ChemCP](https://www.npmjs.com/package/chemcp)** | `npm install -g chemcp` | Interactive 2D molecular viewer using RDKit.js. Computed properties (MW, LogP, HBD/HBA, TPSA). Clickable in-chat UI. |
| **[PubChem-MCP-Server](https://hexmos.com/freedevtools/mcp/scientific-research-tools/JackKuo666--PubChem-MCP-Server/)** | MCP config | Search by name, SMILES, compound ID. Roadmap: 2D/3D visualization, local caching. |
| **[BioChemAIgent](https://www.biorxiv.org/content/biorxiv/early/2026/01/22/2025.12.17.694892.source.xml)** | bioRxiv preprint | 27+ tools. End-to-end drug discovery: SMILES/SDF processing, AlphaFold 3, molecular docking (Vina, Smina, Gnina, DiffDock), protein-ligand interaction viz. Integrates PubChem + PDB MCPs. |
| **[CatGo](https://chemrxiv.org/doi/full/10.26434/chemrxiv.15002984/v1)** | ChemRxiv (May 2026) | DAG workflow generation from NL. Heterogeneous orchestration (VASP, CP2K, ORCA, LAMMPS). Visual workflow editor. |
| **[Heimdall](https://www.npmjs.com/package/@cavall/heimdall-mcp-server)** | npm install | Hand-drawn chemical structures → SMILES. Uses Ketcher + Indigo for graph recognition. 16 tools. |

---

# 🗺️ Quick-Start Stack Recommendation

```
User prompt (Natural Language)
    │
    ▼
Claude Code + manim_skill (adithya-s-k)   ← best practices injected automatically
    │
    ├─► Manim MCP (Stelath)               ← renders MP4 videos
    ├─► mcp-server-jsxgraph               ← quick interactive previews (no render wait)
    ├─► IBM/chuk-mcp-physics              ← physics calculations when needed
    ├─► chemdraw-mcp                      ← chemical structures when needed
    └─► ManimCommunity/manim              ← the engine underneath
```

For physics content, swap the engine to `manim-physics` by Matheart.
For chemistry, bolt on `manim-chemistry` by UnMolDeQuimica.

---

> **The 2025–2026 trend:** AI agents (Claude Code, Cursor, Copilot) writing Manim scripts via MCP servers, with zero-LaTeX and auto-voiceover pipelines becoming default. The barrier to 3Blue1Brown-quality output has collapsed.

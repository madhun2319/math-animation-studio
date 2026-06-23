# Event Horizon — An Interactive Atlas of Black-Hole Physics

A dependency-free, no-build web app: a **real-time gravitational-lensing black
hole** rendered in WebGL, wired to physically-correct relativity calculators.
Fly around the hole, change its mass, and watch the numbers — every readout is
computed from first principles.

## Run it

No server, no build step. Just open the file:

```
H:/Pyhsics_Animation/index.html   →   double-click, or open in a browser
```

A WebGL-capable browser is required for the live render (Chrome, Edge, Firefox,
Safari). The fonts load from Google Fonts, so the first load needs internet; the
physics works offline either way. If WebGL is missing, the page falls back to a
static gradient and everything else still works.

## What's inside

| Section         | What it does |
|-----------------|--------------|
| **Hero**        | Full-screen live black hole. Drag to orbit it. |
| **Observatory** | Sliders for mass, inclination, spin/Doppler, disk temperature, brightness and turbulence, plus a live readout of the hole's key radii, temperature and lifetime. Real-object presets (Sun, Sgr A*, M87*, TON 618…). |
| **Anatomy**     | Annotated cross-section: singularity → horizon → photon sphere → ISCO → ergosphere → disk. Hover the labels to highlight the diagram. |
| **Phenomena**   | Lensing, **interactive time dilation** (two clocks drift apart as you fall in), spaghettification, Hawking radiation, the information paradox. |
| **Calculator**  | Enter any mass and see what it becomes as a black hole. |

## How the render works

For every pixel a light ray is marched **backwards** from the camera. At each
step it is bent toward the singularity using the geodesic-curvature term of the
Schwarzschild metric,

```
d²u/dφ² + u = 3 M u²      (u = 1/r)
```

written in vector form as an acceleration `a = −1.5 · h² · r / |r|⁵`, where
`h = r × v` is the photon's conserved specific angular momentum. Distances are
in units of the Schwarzschild radius (horizon at `|r| = 1`), which is why the
image is **scale-invariant** — a real Schwarzschild hole looks identical at any
mass; only the physical numbers change. Along the way the ray samples a flat
equatorial accretion disk (temperature gradient + animated turbulence +
relativistic Doppler beaming) and, if it escapes, a lensed procedural starfield.

The visualization is physically *motivated* but artistically tuned for clarity;
the readouts and calculator are exact.

## The physics (`js/physics.js`)

| Quantity | Formula |
|----------|---------|
| Schwarzschild radius | `rₛ = 2GM/c²` |
| Photon sphere | `1.5 rₛ` |
| ISCO | `3 rₛ` |
| Surface gravity | `κ = c⁴ / 4GM` |
| Hawking temperature | `T = ℏc³ / 8πGMk_B` |
| Hawking power | `P = ℏc⁶ / 15360πG²M²` |
| Evaporation time | `t = 5120πG²M³ / ℏc⁴` |
| Time dilation | `dτ/dt = √(1 − rₛ/r)` |
| Tidal acceleration | `a = 2GML / r³` |

## Files

```
index.html        structure + content
css/style.css     the observatory-instrument styling
js/physics.js     constants, formulas, unit-aware formatters (no DOM)
js/blackhole.js   WebGL ray-bending renderer
js/app.js         UI wiring
```

## Tuning the look

Open `js/blackhole.js` and edit the `state` defaults (disk radii, spin,
brightness, turbulence) or the shader's `blackbody()` palette and `STEPS` count
(lower it if your GPU struggles; higher for smoother lensing).

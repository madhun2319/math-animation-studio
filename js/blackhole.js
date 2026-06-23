/* ============================================================================
   blackhole.js — Real-time gravitational-lensing renderer (WebGL1)
   ----------------------------------------------------------------------------
   A single full-screen fragment shader marches a light ray *backwards* from the
   camera. At every step the ray is bent toward the singularity using the
   geodesic-curvature term of a Schwarzschild metric:

        d^2(u)/dphi^2 + u = 3 M u^2        (u = 1/r)

   expressed in vector form as an acceleration  a = -1.5 h^2 * r / |r|^5, where
   h = r x v is the conserved specific angular momentum. Distances are measured
   in units of the Schwarzschild radius (horizon at |r| = 1), which makes the
   image scale-invariant — exactly as real Schwarzschild holes are.

   Along the way the ray samples a flat equatorial accretion disk (temperature
   gradient + animated turbulence + relativistic Doppler beaming) and, if it
   escapes, a lensed procedural starfield. The result is the familiar
   "Gargantua" silhouette: a black void wrapped in a warped ring of fire.
   ========================================================================== */

window.BlackHole = (function () {
  "use strict";

  // -------------------------------------------------------------------------
  // Shaders
  // -------------------------------------------------------------------------
  const VERT = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;

    uniform vec2  uRes;       // viewport resolution (px)
    uniform float uTime;      // seconds
    uniform mat3  uCam;       // camera basis: columns = right, up, forward
    uniform vec3  uCamPos;    // camera position (units of r_s)
    uniform float uDiskInner; // inner disk radius
    uniform float uDiskOuter; // outer disk radius
    uniform float uSpin;      // 0..1 — drives Doppler asymmetry
    uniform float uTemp;      // -0.5..0.5 — disk colour temperature bias
    uniform float uBright;    // disk brightness
    uniform float uTurb;      // disk turbulence amount

    #define STEPS 256
    #define PI 3.141592653589793

    // --- hash / value noise -------------------------------------------------
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 x) {
      vec3 p = floor(x), f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
            mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
            mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
    }
    float fbm(vec3 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
      return v;
    }

    // Disk colour by normalized temperature t (0 cool/outer .. 1 hot/inner).
    vec3 blackbody(float t) {
      vec3 cool = vec3(1.00, 0.27, 0.05);   // deep orange-red
      vec3 mid  = vec3(1.00, 0.66, 0.26);   // gold
      vec3 hot  = vec3(0.78, 0.88, 1.00);   // blue-white
      vec3 c = mix(cool, mid, smoothstep(0.0, 0.55, t));
      c = mix(c, hot, smoothstep(0.55, 1.0, t));
      return c;
    }

    // Procedural starfield + faint nebula for an escaped ray direction.
    vec3 starfield(vec3 dir) {
      vec3 col = vec3(0.0);
      // three cell sizes of point stars for parallax-like depth
      for (float k = 0.0; k < 3.0; k += 1.0) {
        float scale = 110.0 + k * 170.0;
        vec3 cell = floor(dir * scale);
        float h = hash(cell + k * 7.0);
        float s = smoothstep(0.991, 1.0, h);
        float tw = 0.55 + 0.45 * sin(uTime * 2.0 + h * 60.0); // twinkle
        // faint colour temperature variation per star
        vec3 tint = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.85, 0.7), hash(cell + 3.0));
        col += vec3(s) * tw * tint * (1.0 - k * 0.28);
      }
      // cold dust glow, two-tone
      float neb = fbm(dir * 2.6 + vec3(11.0));
      col += pow(neb, 3.0) * vec3(0.06, 0.07, 0.12);
      float neb2 = fbm(dir * 1.3 + vec3(40.0));
      col += pow(neb2, 4.0) * vec3(0.10, 0.05, 0.09);
      return col;
    }

    // Filmic ACES tonemap.
    vec3 aces(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14),
                   0.0, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

      vec3 pos = uCamPos;
      vec3 dir = normalize(uCam * vec3(uv, 1.55)); // 1.55 ~ focal length
      vec3 dir0 = dir;                              // initial ray, for lensing magnification

      // conserved specific angular momentum of this photon
      vec3 hvec = cross(pos, dir);
      float h2 = dot(hvec, hvec);

      vec3 color = vec3(0.0);
      float transmit = 1.0;     // remaining light not yet blocked by the disk
      bool captured = false;
      float prevY = pos.y;

      for (int i = 0; i < STEPS; i++) {
        float r2 = dot(pos, pos);
        float r  = sqrt(r2);

        if (r < 1.0) { captured = true; break; }            // event horizon
        if (r > 40.0 && dot(pos, dir) > 0.0) break;          // escaped to infinity

        // adaptive step: fine near the hole, coarse far away
        float dt = clamp(0.045 * r, 0.04, 0.55);

        // geodesic bending toward the singularity
        vec3 accel = -1.5 * h2 * pos / (r2 * r2 * r);
        vec3 nextPos = pos + dir * dt;
        dir = normalize(dir + accel * dt);

        // accretion-disk crossing of the equatorial plane (y = 0)
        if (prevY * nextPos.y < 0.0) {
          float f = prevY / (prevY - nextPos.y);
          vec3 hit = mix(pos, nextPos, f);
          float rr = length(hit.xz);
          if (rr > uDiskInner && rr < uDiskOuter) {
            float radial = (rr - uDiskInner) / (uDiskOuter - uDiskInner);
            float temp = pow(1.0 - radial, 1.4);            // hotter inside

            // Keplerian-ish differential rotation feeds the turbulence
            float ang = atan(hit.z, hit.x);
            float spin = uTime * 0.85 / pow(rr, 1.5) * 6.0;
            float tb = fbm(vec3(cos(ang) * rr, sin(ang) * rr, 0.0) * 1.3
                           + vec3(0.0, 0.0, spin));
            float dens = smoothstep(0.0, 0.12, radial)
                       * smoothstep(1.0, 0.65, radial);
            dens *= mix(1.0, tb * 1.7, clamp(uTurb, 0.0, 1.0));

            // relativistic Doppler beaming: gas swinging toward us brightens
            vec3 vel = normalize(vec3(-hit.z, 0.0, hit.x));
            float dop = dot(vel, -normalize(dir));
            float beam = max(1.0 + uSpin * dop * 2.1, 0.0);

            float tShift = clamp(temp + uSpin * dop * 0.30 + uTemp, 0.0, 1.0);
            vec3 dcol = blackbody(tShift);
            // relativistic colour shift: gas swinging toward us tints blue,
            // gas receding tints red (bounded so it stays physical-looking)
            dcol *= clamp(vec3(1.0 - uSpin * dop * 0.18, 1.0,
                               1.0 + uSpin * dop * 0.22), 0.6, 1.4);
            float emit = dens * beam * (0.85 + uBright * 1.8);
            color += transmit * dcol * emit * 0.5;
            transmit *= 0.88;                               // disk is semi-opaque
          }
        }

        pos = nextPos;
        prevY = pos.y;
        if (transmit < 0.02) break;
      }

      if (!captured) {
        // gravitational lensing magnification: the more the ray bent on its
        // way past the hole, the more it magnifies & brightens the background.
        // This is what lifts background stars into the bright Einstein ring.
        float defl = acos(clamp(dot(dir0, normalize(dir)), -1.0, 1.0));
        float mag = 1.0 + smoothstep(0.4, 3.1, defl) * 3.5;
        color += transmit * starfield(normalize(dir)) * mag;
      }

      // ---- cinematic post-process -----------------------------------------
      // multi-tap bloom lift: brightest cores bleed light outward
      vec3 over = max(color - 0.55, 0.0);
      color += over * over * 0.55;                 // soft glow on hot disk
      color += pow(over, vec3(1.6)) * 0.35;        // tighter highlight core

      // radial vignette — darken the frame edges, draw the eye inward
      float vig = 1.0 - 0.34 * dot(uv, uv);
      color *= clamp(vig, 0.0, 1.0);

      color = aces(color * 1.08);
      color = pow(color, vec3(1.0 / 2.2));                  // gamma

      // subtle film grain (breaks up banding in the dark gradients)
      float g = hash(vec3(gl_FragCoord.xy, uTime)) - 0.5;
      color += g * 0.025;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // -------------------------------------------------------------------------
  // Renderer
  // -------------------------------------------------------------------------
  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
    }
    return s;
  }

  function create(canvas) {
    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) throw new Error("WebGL unavailable");

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "program link failed");
    }
    gl.useProgram(prog);

    // full-screen triangle pair
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), time: U("uTime"), cam: U("uCam"), camPos: U("uCamPos"),
      diskInner: U("uDiskInner"), diskOuter: U("uDiskOuter"),
      spin: U("uSpin"), temp: U("uTemp"), bright: U("uBright"), turb: U("uTurb"),
    };

    // ---- view + parameter state -------------------------------------------
    const HOME_DISTANCE = 15.0;     // resting camera radius (units of r_s)
    const state = {
      azimuth: 0.6,        // radians, auto-advances
      inclination: 0.16,   // radians above the equatorial plane (near edge-on)
      distance: 52.0,      // starts far out; intro flythrough eases it home
      autoRotate: false,   // off during the intro, on after
      intro: true,         // cinematic dolly-in on load
      introT: 0,           // 0..1 progress of the flythrough
      spin: 0.55,
      temp: 0.0,
      bright: 0.5,
      turb: 0.7,
      diskInner: 2.7,
      diskOuter: 11.0,
    };

    // pixel budget: cap backing resolution so the heavy shader stays smooth
    let scale = 1;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const wCss = canvas.clientWidth || window.innerWidth;
      const hCss = canvas.clientHeight || window.innerHeight;
      const cap = 1500;                       // max backing width
      scale = Math.min(1, cap / (wCss * dpr));
      const w = Math.max(1, Math.round(wCss * dpr * scale));
      const h = Math.max(1, Math.round(hCss * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    // build an orthonormal camera basis looking at the origin
    function cameraBasis() {
      const { distance, inclination, azimuth } = state;
      const cp = [
        distance * Math.cos(inclination) * Math.cos(azimuth),
        distance * Math.sin(inclination),
        distance * Math.cos(inclination) * Math.sin(azimuth),
      ];
      const len = (v) => Math.hypot(v[0], v[1], v[2]);
      const norm = (v) => { const l = len(v) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
      const cross = (a, b) => [
        a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0],
      ];
      const forward = norm([-cp[0], -cp[1], -cp[2]]);     // toward origin
      const right = norm(cross(forward, [0, 1, 0]));
      const up = cross(right, forward);
      // column-major mat3: right, up, forward
      const m = [
        right[0], right[1], right[2],
        up[0], up[1], up[2],
        forward[0], forward[1], forward[2],
      ];
      return { m, cp };
    }

    const start = performance.now();
    let prev = start;
    let running = true;
    let raf = 0;

    function frame(now) {
      if (!running) return;
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      // cinematic intro: dolly from far in to the resting distance (~4.5s),
      // drifting in azimuth the whole time, then hand control to auto-orbit.
      if (state.intro) {
        state.introT = Math.min(1, state.introT + dt / 4.5);
        const e = 1 - Math.pow(1 - state.introT, 3);    // easeOutCubic
        state.distance = 52.0 + (HOME_DISTANCE - 52.0) * e;
        state.azimuth += dt * 0.12 * (1 - e * 0.6);
        if (state.introT >= 1) { state.intro = false; state.autoRotate = true; }
      } else if (state.autoRotate) {
        state.azimuth += dt * 0.07;
      }

      resize();
      const { m, cp } = cameraBasis();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniformMatrix3fv(u.cam, false, new Float32Array(m));
      gl.uniform3fv(u.camPos, new Float32Array(cp));
      gl.uniform1f(u.diskInner, state.diskInner);
      gl.uniform1f(u.diskOuter, state.diskOuter);
      gl.uniform1f(u.spin, state.spin);
      gl.uniform1f(u.temp, state.temp);
      gl.uniform1f(u.bright, state.bright);
      gl.uniform1f(u.turb, state.turb);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // pause when the tab is hidden — the shader is expensive
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });

    // ---- pointer drag to orbit --------------------------------------------
    let dragging = false, lastX = 0, lastY = 0;
    const down = (x, y) => {
      dragging = true; lastX = x; lastY = y;
      state.autoRotate = false;
      state.intro = false;            // user grabbed control — stop the flythrough
    };
    const move = (x, y) => {
      if (!dragging) return;
      state.azimuth -= (x - lastX) * 0.006;
      state.inclination = Math.max(-1.45, Math.min(1.45,
        state.inclination + (y - lastY) * 0.005));
      lastX = x; lastY = y;
    };
    const up = () => { dragging = false; };
    canvas.addEventListener("pointerdown", (e) => down(e.clientX, e.clientY));
    window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("pointerup", up);

    return {
      state,
      set(partial) { Object.assign(state, partial); },
      resume() {
        // replay the cinematic flythrough from far out
        state.intro = true;
        state.introT = 0;
        state.autoRotate = false;
        state.distance = 52.0;
      },
    };
  }

  return { create };
})();

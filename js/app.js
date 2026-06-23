/* ============================================================================
   app.js — UI wiring
   Connects the controls, readouts, anatomy diagram, time-dilation widget and
   calculator to the physics engine and the live renderer.
   ========================================================================== */
(function () {
  "use strict";
  const P = window.Physics;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- 0. Start the renderer (degrade gracefully) ----------------------- */
  let bh = null;
  try {
    bh = window.BlackHole.create($("#bh-canvas"));
  } catch (e) {
    $("#bh-canvas").style.background =
      "radial-gradient(circle at 50% 45%, #1a0f04 0%, #000 60%)";
    console.warn("WebGL renderer unavailable:", e.message);
  }

  /* ---- 1. Mass slider (log scale) + presets ----------------------------- */
  // Slider 0..1000 maps logarithmically across 1e22 .. 1e41 kg.
  const LOG_MIN = Math.log10(1e22);
  const LOG_MAX = Math.log10(1e41);
  const sliderToMass = (v) =>
    Math.pow(10, LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN));
  const massToSlider = (m) =>
    ((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000;

  const PRESETS = [
    { label: "Earth", name: "Earth, collapsed", kg: P.M_earth },
    { label: "Sun", name: "The Sun, collapsed", kg: P.M_sun },
    { label: "Cygnus X-1", name: "Cygnus X-1", kg: 21 * P.M_sun },
    { label: "Sgr A*", name: "Sagittarius A*", kg: 4.297e6 * P.M_sun },
    { label: "M87*", name: "M87* (first imaged)", kg: 6.5e9 * P.M_sun },
    { label: "TON 618", name: "TON 618", kg: 6.6e10 * P.M_sun },
  ];

  const massSlider = $("#mass");
  const readoutEl = $("#readout");
  const readoutName = $("#readout-name");
  let currentName = "The Sun, collapsed";

  function row(dt, dd) {
    return `<div class="readout__row"><dt>${dt}</dt><dd>${dd}</dd></div>`;
  }

  function updateReadout(M) {
    const r = P.report(M);
    $("#mass-val").textContent = P.num(M / P.M_sun, 3) + " M☉";
    readoutName.textContent = currentName;
    readoutEl.innerHTML =
      row("Mass", P.num(M / P.M_sun) + " M☉") +
      row("Schwarzschild radius", "<em>" + P.length(r.schwarzschildRadius) + "</em>") +
      row("Horizon diameter", P.length(r.diameter)) +
      row("Photon sphere", P.length(r.photonSphere)) +
      row("ISCO", P.length(r.isco)) +
      row("Mean density", P.num(r.meanDensity) + " kg/m³") +
      row("Surface gravity", P.num(r.surfaceGravity) + " m/s²") +
      row("Hawking temperature", P.temperature(r.hawkingTemp)) +
      row("Evaporation time", "<em>" + P.time(r.evaporationTime) + "</em>");
  }

  massSlider.addEventListener("input", () => {
    currentName = "Custom mass";
    setPresetActive(-1);
    updateReadout(sliderToMass(+massSlider.value));
  });

  // preset buttons
  const presetRow = $("#preset-row");
  PRESETS.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "preset";
    b.textContent = p.label;
    b.addEventListener("click", () => {
      currentName = p.name;
      massSlider.value = Math.max(0, Math.min(1000, massToSlider(p.kg)));
      setPresetActive(i);
      updateReadout(p.kg);
    });
    presetRow.appendChild(b);
  });
  function setPresetActive(idx) {
    $$(".preset", presetRow).forEach((b, i) =>
      b.classList.toggle("active", i === idx));
  }

  /* ---- 2. Render controls ----------------------------------------------- */
  function bindRange(id, fn) {
    const el = $("#" + id);
    const apply = () => fn(+el.value, el);
    el.addEventListener("input", apply);
    apply();
  }
  if (bh) {
    bindRange("incl", (v, el) => {
      const rad = (v / 100) * 1.35;            // up to ~77° above the plane
      bh.set({ inclination: rad });
      $("#incl-val").textContent = Math.round((rad * 180) / Math.PI) + "°";
    });
    bindRange("spin", (v) => {
      const s = v / 100;
      // higher spin shrinks the disk's inner edge (smaller prograde ISCO)
      bh.set({ spin: s, diskInner: 2.9 - s * 1.5 });
      $("#spin-val").textContent = s.toFixed(2);
    });
    bindRange("temp", (v) => {
      bh.set({ temp: v / 100 });
      $("#temp-val").textContent =
        v === 0 ? "neutral" : v > 0 ? "+" + v + " hot" : v + " cool";
    });
    bindRange("bright", (v) => {
      bh.set({ bright: v / 100 });
      $("#bright-val").textContent = (v / 100).toFixed(2);
    });
    bindRange("turb", (v) => {
      bh.set({ turb: v / 100 });
      $("#turb-val").textContent = (v / 100).toFixed(2);
    });
    $("#reset-view").addEventListener("click", () => {
      bh.set({ inclination: (12 / 100) * 1.35, azimuth: 0.6 });
      bh.resume();
      $("#incl").value = 12;
      $("#incl-val").textContent = "9°";
    });
  }

  // initial readout (matches default slider value)
  setPresetActive(1);
  updateReadout(P.M_sun);

  /* ---- 3. Anatomy hover wiring ------------------------------------------ */
  const diagram = $(".anatomy__diagram");
  $$(".anatomy__legend li").forEach((li) => {
    const cls = li.dataset.target;
    const target = diagram && $("." + cls, diagram);
    if (!target) return;
    li.addEventListener("mouseenter", () => target.classList.add("hot"));
    li.addEventListener("mouseleave", () => target.classList.remove("hot"));
  });

  /* ---- 4. Time-dilation widget ------------------------------------------ */
  const dilSlider = $("#dil-slider");
  const farHand = $("#clock-far .clock__hand");
  const nearHand = $("#clock-near .clock__hand");
  let dilFactor = 1; // dtau/dt at the chosen radius

  function updateDilation() {
    const r = +dilSlider.value / 100; // radius in units of r_s (>1)
    dilFactor = Math.sqrt(1 - 1 / r);
    const ratio = dilFactor > 0 ? 1 / dilFactor : Infinity;
    $("#dil-r").innerHTML = r.toFixed(2) + " r<sub>s</sub>";
    $("#near-rate").textContent = dilFactor.toFixed(3) + "×";
    $("#far-rate").textContent = "1.00×";
    $("#dil-readout").textContent =
      "1 second here = " + P.num(ratio, 4) + " s far away.";
  }
  dilSlider.addEventListener("input", updateDilation);
  updateDilation();

  // animate the two clock hands at their respective rates
  let farAngle = 0, nearAngle = 0, last = performance.now();
  (function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    farAngle = (farAngle + dt * 90) % 360;        // 90°/s reference clock
    nearAngle = (nearAngle + dt * 90 * dilFactor) % 360;
    if (farHand) farHand.style.transform = `rotate(${farAngle}deg)`;
    if (nearHand) nearHand.style.transform = `rotate(${nearAngle}deg)`;
    requestAnimationFrame(tick);
  })(last);

  /* ---- 5. Calculator ---------------------------------------------------- */
  const calcMass = $("#calc-mass");
  const calcUnit = $("#calc-unit");
  const calcResults = $("#calc-results");
  const CALC_PRESETS = [
    { label: "A human (70 kg)", kg: 70 },
    { label: "Mount Everest", kg: 8.1e14 },
    { label: "Earth", kg: P.M_earth },
    { label: "Jupiter", kg: 1.898e27 },
    { label: "The Sun", kg: P.M_sun },
    { label: "Sagittarius A*", kg: 4.297e6 * P.M_sun },
    { label: "M87*", kg: 6.5e9 * P.M_sun },
  ];

  function calcKg() {
    const v = parseFloat(calcMass.value) || 0;
    if (calcUnit.value === "solar") return v * P.M_sun;
    if (calcUnit.value === "earth") return v * P.M_earth;
    return v;
  }

  function renderCalc() {
    const M = calcKg();
    if (M <= 0) { calcResults.innerHTML = row("—", "enter a positive mass"); return; }
    const r = P.report(M);
    const hl = (dt, dd) =>
      `<div class="readout__row hl"><dt>${dt}</dt><dd>${dd}</dd></div>`;
    calcResults.innerHTML =
      hl("Schwarzschild radius", P.length(r.schwarzschildRadius)) +
      row("Horizon diameter", P.length(r.diameter)) +
      row("Photon sphere (1.5 r<sub>s</sub>)", P.length(r.photonSphere)) +
      row("ISCO (3 r<sub>s</sub>)", P.length(r.isco)) +
      row("Mean density", P.num(r.meanDensity) + " kg/m³") +
      row("Surface gravity", P.num(r.surfaceGravity) + " m/s²") +
      row("Tidal stretch at horizon", P.num(r.tidalAtHorizon) + " m/s² over 1.8 m") +
      row("Hawking temperature", P.temperature(r.hawkingTemp)) +
      row("Hawking power", P.num(r.hawkingPower) + " W") +
      hl("Evaporation time", P.time(r.evaporationTime));
  }

  calcMass.addEventListener("input", renderCalc);
  calcUnit.addEventListener("change", renderCalc);

  const calcPresetWrap = $("#calc-presets");
  CALC_PRESETS.forEach((p) => {
    const b = document.createElement("button");
    b.className = "calc__preset";
    b.innerHTML =
      `<span>${p.label}</span><span class="calc__preset-mass">${P.num(p.kg)} kg</span>`;
    b.addEventListener("click", () => {
      calcUnit.value = "kg";
      calcMass.value = p.kg;
      renderCalc();
    });
    calcPresetWrap.appendChild(b);
  });
  renderCalc();

  /* ---- 6. Scroll reveals ------------------------------------------------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));

  /* ---- 7. Cinematic boot + scroll chrome --------------------------------- */
  // Dismiss the boot loader once the first frame is up (or after a max wait,
  // so a missing/slow WebGL context never traps the user on the splash).
  const boot = $("#boot");
  function dismissBoot() {
    if (!boot || boot.classList.contains("done")) return;
    boot.classList.add("done");
    document.body.classList.add("ready");
  }
  // give the renderer a beat to compile + paint, then reveal
  const bootDelay = bh ? 1400 : 300;            // ponytail: fixed delay beats wiring a frame callback
  setTimeout(dismissBoot, bootDelay);
  window.addEventListener("load", () => setTimeout(dismissBoot, bootDelay));

  // Scroll progress rail + nav hairline
  const rail = document.createElement("div");
  rail.className = "scroll-rail";
  document.body.appendChild(rail);
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      rail.style.setProperty("--scroll", p.toFixed(4));
      document.body.classList.toggle("scrolled", h.scrollTop > 40);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

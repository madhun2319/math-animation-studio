/* ============================================================================
   physics.js — Black-hole physics engine
   ----------------------------------------------------------------------------
   Pure functions + constants. No DOM. Exposed on window.Physics so the rest of
   the app (calculator, observatory readouts) can share one source of truth.

   All quantities are SI (kg, m, s, K, W) unless a function name says otherwise.
   Formulas assume a non-rotating Schwarzschild black hole except where noted.
   ========================================================================== */

window.Physics = (function () {
  "use strict";

  // ---- Fundamental constants (CODATA / IAU) --------------------------------
  const G    = 6.67430e-11;        // gravitational constant   [m^3 kg^-1 s^-2]
  const c    = 299792458;          // speed of light           [m s^-1]
  const hbar = 1.054571817e-34;    // reduced Planck constant  [J s]
  const kB   = 1.380649e-23;       // Boltzmann constant       [J K^-1]

  // ---- Reference masses & lengths ------------------------------------------
  const M_sun   = 1.98892e30;      // solar mass               [kg]
  const M_earth = 5.97219e24;      // Earth mass               [kg]
  const AU      = 1.495978707e11;  // astronomical unit        [m]
  const ly      = 9.4607304725808e15; // light-year            [m]
  const pc      = 3.0856775815e16; // parsec                   [m]
  const R_sun   = 6.957e8;         // solar radius             [m]
  const YEAR    = 3.1557600e7;     // Julian year              [s]
  const AGE_UNIVERSE = 13.787e9 * YEAR; // [s]

  // ---- Core relativistic quantities ----------------------------------------

  // Schwarzschild radius  r_s = 2GM/c^2   (the event horizon).
  const schwarzschildRadius = (M) => (2 * G * M) / (c * c);

  // Photon sphere: unstable circular photon orbit at 1.5 r_s.
  const photonSphere = (M) => 1.5 * schwarzschildRadius(M);

  // Innermost Stable Circular Orbit for massive particles (Schwarzschild): 3 r_s.
  const isco = (M) => 3 * schwarzschildRadius(M);

  // Mean density if the mass filled a sphere of radius r_s.
  // Famous result: density falls as 1/M^2, so supermassive holes are "thin".
  const meanDensity = (M) => {
    const r = schwarzschildRadius(M);
    return M / ((4 / 3) * Math.PI * r * r * r);
  };

  // Surface gravity at the horizon  kappa = c^4 / (4 G M)   [m s^-2].
  const surfaceGravity = (M) => (c * c * c * c) / (4 * G * M);

  // ---- Hawking radiation ----------------------------------------------------

  // Hawking temperature  T = hbar c^3 / (8 pi G M kB)   [K].
  // ~6.17e-8 K for one solar mass — colder than the cosmic microwave background.
  const hawkingTemp = (M) => (hbar * c * c * c) / (8 * Math.PI * G * M * kB);

  // Black-body Hawking luminosity  P = hbar c^6 / (15360 pi G^2 M^2)   [W].
  const hawkingPower = (M) =>
    (hbar * Math.pow(c, 6)) / (15360 * Math.PI * G * G * M * M);

  // Evaporation lifetime  t = 5120 pi G^2 M^3 / (hbar c^4)   [s].
  // ~2.1e67 years for the Sun — vastly longer than the age of the universe.
  const evaporationTime = (M) =>
    (5120 * Math.PI * G * G * Math.pow(M, 3)) / (hbar * Math.pow(c, 4));

  // ---- Kinematics around the hole ------------------------------------------

  // Gravitational time-dilation factor at radius r (r > r_s):
  // dtau/dt = sqrt(1 - r_s/r).  Returns 0 at/inside the horizon.
  const timeDilation = (M, r) => {
    const rs = schwarzschildRadius(M);
    return r <= rs ? 0 : Math.sqrt(1 - rs / r);
  };

  // How many seconds elapse far away for 1 s experienced at radius r.
  const dilationRatio = (M, r) => {
    const f = timeDilation(M, r);
    return f === 0 ? Infinity : 1 / f;
  };

  // Newtonian escape velocity sqrt(2GM/r) — equals c exactly at r_s.
  const escapeVelocity = (M, r) => Math.sqrt((2 * G * M) / r);

  // Tidal stretching: difference in gravitational acceleration across a body of
  // height L whose centre sits at radius r.  a = 2 G M L / r^3   [m s^-2].
  // This is what "spaghettifies" an infalling observer.
  const tidalAccel = (M, r, L) => (2 * G * M * L) / (r * r * r);

  // ---- Formatting helpers ---------------------------------------------------
  // Shared by the UI so every readout reads consistently.

  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³",
    4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };

  function superscript(n) {
    return String(n).split("").map((ch) => SUP[ch] ?? ch).join("");
  }

  // General number: plain when human-scaled, scientific (m×10ⁿ) otherwise.
  function num(x, sig = 3) {
    if (!isFinite(x)) return "∞";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e-2 && a < 1e5) {
      const r = parseFloat(x.toPrecision(sig));
      return r.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    const exp = Math.floor(Math.log10(a));
    const mant = x / Math.pow(10, exp);
    return mant.toFixed(2) + "×10" + superscript(exp);
  }

  // Length with an auto-chosen astronomical unit.
  function length(m) {
    const a = Math.abs(m);
    if (a < 1e-9) return num(m * 1e12) + " pm";
    if (a < 1e-6) return num(m * 1e9) + " nm";
    if (a < 1e-3) return num(m * 1e6) + " µm";
    if (a < 1) return num(m * 1e3) + " mm";
    if (a < 1e3) return num(m) + " m";
    if (a < AU * 0.1) return num(m / 1e3) + " km";
    if (a < ly * 0.1) return num(m / AU) + " AU";
    if (a < pc * 1e3) return num(m / ly) + " ly";
    return num(m / pc) + " pc";
  }

  // Mass shown in kg with a solar-mass companion (or Earth masses if tiny).
  function mass(kg) {
    if (kg < M_sun * 1e-3) {
      return num(kg) + " kg  ·  " + num(kg / M_earth) + " M⊕";
    }
    return num(kg) + " kg  ·  " + num(kg / M_sun) + " M☉";
  }

  // Time with an auto-chosen unit, from nanoseconds to gigayears.
  function time(s) {
    const a = Math.abs(s);
    if (a < 1e-6) return num(s * 1e9) + " ns";
    if (a < 1e-3) return num(s * 1e6) + " µs";
    if (a < 1) return num(s * 1e3) + " ms";
    if (a < 90) return num(s) + " s";
    if (a < 5400) return num(s / 60) + " min";
    if (a < 1.5 * 86400) return num(s / 3600) + " h";
    if (a < 400 * 86400) return num(s / 86400) + " days";
    if (a < 1e3 * YEAR) return num(s / YEAR) + " yr";
    if (a < 1e6 * YEAR) return num(s / (1e3 * YEAR)) + " kyr";
    if (a < 1e9 * YEAR) return num(s / (1e6 * YEAR)) + " Myr";
    if (a < 1e12 * YEAR) return num(s / (1e9 * YEAR)) + " Gyr";
    return num(s / YEAR) + " yr";
  }

  // Temperature: K, with °C alongside for human-scale values.
  function temperature(K) {
    if (K >= 1e5 || K < 1e-3) return num(K) + " K";
    return num(K) + " K  ·  " + num(K - 273.15) + " °C";
  }

  // Build the full readout set for a given mass (kg). Used by the calculator.
  function report(M) {
    const rs = schwarzschildRadius(M);
    return {
      mass: M,
      schwarzschildRadius: rs,
      diameter: 2 * rs,
      photonSphere: photonSphere(M),
      isco: isco(M),
      meanDensity: meanDensity(M),
      surfaceGravity: surfaceGravity(M),
      hawkingTemp: hawkingTemp(M),
      hawkingPower: hawkingPower(M),
      evaporationTime: evaporationTime(M),
      // Tidal acceleration at the horizon across a 1.8 m human, per kg.
      tidalAtHorizon: tidalAccel(M, rs, 1.8),
    };
  }

  return {
    // constants
    G, c, hbar, kB, M_sun, M_earth, AU, ly, pc, R_sun, YEAR, AGE_UNIVERSE,
    // physics
    schwarzschildRadius, photonSphere, isco, meanDensity, surfaceGravity,
    hawkingTemp, hawkingPower, evaporationTime,
    timeDilation, dilationRatio, escapeVelocity, tidalAccel, report,
    // formatting
    num, length, mass, time, temperature, superscript,
  };
})();

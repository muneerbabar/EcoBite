/* EcoBite application shell: routing, state, dashboard, results, e-portfolio, leaderboard, SCORM sync. */
(function () {
  var E = window.ECO, CFG = window.ECO_CONFIG, ENG = window.ENG, h = ENG.h, clamp = ENG.clamp;
  var KEY = "ecobite.v1", app = document.getElementById("app"), cleanup = null, lastResult = null, uid = 0;
  var NOCARBON = { "3.2": 1, "4.2": 1, "4.3": 1, "5.1": 1, "5.2": 1, "5.3": 1 };
  function rnd() { return Math.floor(1000 + Math.random() * 9000); }
  function fresh() { return { alias: "Practitioner-" + rnd(), name: "", relaxed: false, preview: false, g: {}, refl: {} }; }
  function load() { try { var j = JSON.parse(localStorage.getItem(KEY)); if (j && j.g) return j; } catch (e) {} return fresh(); }
  var S = load();
  var lms = Scorm.init();
  if (lms) {
    try { var sd = JSON.parse(Scorm.suspendData() || "null"); if (sd && sd.g) { if (sd.a) S.alias = sd.a; S.relaxed = !!sd.x; Object.keys(sd.g).forEach(function (id) { var a = sd.g[id], cur = S.g[id] || {}; if (!cur.s || a[0] > cur.s) S.g[id] = { s: a[0], p: !!a[1], t: a[2], k: a[3] }; }); } } catch (e) {}
  }
  if (lms && !S.name) S.name = Scorm.learnerName().replace(/^([^,]+),\s*(.+)$/, "$2 $1");
  function fix(x, n) { var p = Math.pow(10, n == null ? 1 : n); return Math.round(x * p) / p; }
  function G(id) { return E.games.filter(function (g) { return g.id === id; })[0]; }
  function gamesOf(n) { return E.games.filter(function (g) { return g.level === n; }); }
  function levelDone(n) { return gamesOf(n).every(function (g) { return S.g[g.id] && S.g[g.id].p; }); }
  function unlocked(n) { return n === 1 || S.preview || CFG.unlockAll || /[?&]unlock=all/.test(location.search) || levelDone(n - 1); }
  function totalScore() { return Math.round(E.games.reduce(function (a, g) { return a + ((S.g[g.id] || {}).s || 0); }, 0) / E.games.length); }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    var all = E.games.every(function (g) { return S.g[g.id] && S.g[g.id].p; });
    var g = {}; Object.keys(S.g).forEach(function (id) { var x = S.g[id]; g[id] = [x.s || 0, x.p ? 1 : 0, x.t || 0, x.k == null ? 0 : x.k]; });
    Scorm.report({ score: totalScore(), status: all ? "passed" : "incomplete", location: location.hash, suspend: JSON.stringify({ a: S.alias, x: S.relaxed ? 1 : 0, g: g }) });
    vitals();
  }
  function mix(a, b, t) { var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); }), pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); }); return "#" + pa.map(function (x, i) { return ("0" + Math.round(x + (pb[i] - x) * t).toString(16)).slice(-2); }).join(""); }

  /* ---------- Earth ---------- */
  function earth(health, haze, cls) {
    var id = "e" + (++uid), oc = mix("#5f7f86", "#1d7c8c", health), land = mix("#8a7f5f", "#3f9d57", health);
    var d = '<svg class="' + (cls || "earth") + '" viewBox="0 0 400 400" role="img" aria-label="Planet Earth, ' + (haze > .5 ? "hazy and stressed" : "healthy") + '"><defs><clipPath id="c' + id + '"><circle cx="200" cy="200" r="170"/></clipPath><radialGradient id="g' + id + '" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>' +
      '<circle cx="200" cy="200" r="186" fill="' + mix("#bfe3ea", "#d6c9b0", haze) + '" opacity=".55"/><circle cx="200" cy="200" r="170" fill="' + oc + '"/>' +
      '<g clip-path="url(#c' + id + ')"><g class="spin"><path fill="' + land + '" d="M120 120C150 90 190 110 185 150 180 190 150 200 160 240 165 275 140 300 120 280 95 250 105 200 90 170 85 145 100 130 120 120Z"/><path fill="' + land + '" d="M235 110C265 95 300 110 305 140 310 175 285 190 290 225 292 260 265 285 245 262 225 235 235 205 220 180 210 150 215 125 235 110Z"/><path fill="' + land + '" d="M300 200C330 190 350 210 340 240 330 265 300 262 296 238Z"/><path fill="' + land + '" d="M90 330C140 310 200 335 260 325 300 320 330 330 340 345 280 375 150 375 90 330Z" opacity=".9"/><path fill="' + land + '" d="M60 60C110 45 170 55 220 50 260 48 300 60 330 75 280 95 120 90 60 60Z" opacity=".8"/></g></g>' +
      '<circle cx="200" cy="200" r="170" fill="#6b5a3a" opacity="' + (haze * .55).toFixed(2) + '"/><circle cx="200" cy="200" r="170" fill="url(#g' + id + ')"/></svg>';
    return d;
  }
  function vitals() {
    var v = document.getElementById("vitals"), lv = [1, 2, 3, 4, 5].filter(levelDone).length;
    v.innerHTML = "<span>Planet Health Index <b>" + totalScore() + "</b></span><span>Orbits <b>" + lv + "/5</b></span>" + (Scorm.isActive() ? '<span class="pill ok">LMS connected</span>' : "");
    document.querySelectorAll(".top nav a").forEach(function (a) { a.classList.toggle("on", location.hash.indexOf(a.getAttribute("href")) === 0); });
  }

  /* ---------- Router ---------- */
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    document.onkeydown = null;
    var p = (location.hash || "#/home").replace(/^#\/?/, "").split("/");
    app.innerHTML = "";
    var f = { home: home, map: map, level: level, play: play, result: result, portfolio: portfolio, board: board, about: about }[p[0]] || home;
    f(p[1]); vitals(); window.scrollTo(0, 0); app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  /* ---------- Home ---------- */
  function home() {
    var started = Object.keys(S.g).length > 0, name = h("input", { type: "text", value: S.alias, id: "alias", "aria-label": "Anonymous alias", maxlength: 24 });
    name.addEventListener("change", function () { S.alias = name.value.trim() || S.alias; save(); });
    var relaxed = h("input", { type: "checkbox", id: "rx" }); relaxed.checked = S.relaxed; relaxed.addEventListener("change", function () { S.relaxed = relaxed.checked; save(); });
    app.append(h("section", { class: "hero" },
      h("div", {},
        h("span", { class: "pill sun" }, "Serious clinical simulation"),
        h("h1", {}, "EcoBite: The Planetary Practitioner"),
        h("p", { class: "lede" }, "Turn environmental awareness into chairside competence. Five orbits take you from sorting waste on the operatory floor to negotiating treaties, with carbon literacy, waste diversion and systems thinking built into every decision."),
        h("div", { class: "engine" }, h("b", {}, "The Sustainable Value Engine"), h("br"), h("code", {}, "Sustainable Value = (Clinical Outcomes + Social Impact) / (Financial Costs + Environmental Harm)"),
          h("p", { class: "small muted", style: "margin:8px 0 0" }, "Every choice moves three dials: Clinical Health Integrity (keep it at 80% or above), Clinic Budget, and the Planetary Footprint.")),
        h("div", { class: "row", style: "margin-top:18px" }, h("a", { class: "btn primary", href: "#/map" }, started ? "Continue your orbit" : "Begin Orbit 1"), h("a", { class: "btn ghost", href: "#/about" }, "How it works and the evidence")),
        h("div", { class: "card", style: "margin-top:18px" }, h("label", { for: "alias" }, h("b", {}, "Your anonymous alias "), h("span", { class: "muted small" }, "(shown on leaderboards)")), name,
          h("label", { class: "toggle", for: "rx", style: "margin-top:10px" }, relaxed, h("span", {}, h("b", {}, "Untimed mode"), h("br"), h("span", { class: "muted small" }, "Removes countdowns and slows moving targets. Recommended for accessibility.")), h("span")),
          Scorm.isActive() ? h("p", { class: "small ok" }, "Connected to your LMS: scores save to the gradebook automatically.") : h("p", { class: "small muted" }, "Stand-alone mode: progress saves in this browser."))),
      h("div", { class: "earthwrap", html: earth(started ? .35 + totalScore() / 100 * .65 : .5, started ? 1 - totalScore() / 100 : .4) })));
    app.append(h("div", { class: "grid g3" }, E.levels.map(function (L) {
      return h("div", { class: "card" }, h("span", { class: "pill", style: "background:" + L.color + ";color:#fff" }, "Orbit " + L.n + " " + L.key), h("h3", { style: "margin-top:8px" }, L.title), h("p", { class: "small muted" }, L.audience), h("p", { class: "small" }, L.objective));
    })));
  }

  /* ---------- Map ---------- */
  function map() {
    var svg = '<svg class="orbitsvg" viewBox="-210 -210 420 420" role="group" aria-label="Five orbits around the Earth"><g transform="translate(-100,-100) scale(.5)">' + earth(.4 + totalScore() / 170, 1 - totalScore() / 100, "").replace(/<svg[^>]*>/, "").replace("</svg>", "") + "</g>";
    var parts = svg;
    E.levels.forEach(function (L, i) {
      var r = 62 + i * 29, done = levelDone(L.n), open = unlocked(L.n), ang = (-90 + i * 72) * Math.PI / 180, x = Math.cos(ang) * r, y = Math.sin(ang) * r;
      parts += '<circle r="' + r + '" fill="none" stroke="' + (done ? L.color : "var(--line)") + '" stroke-width="' + (done ? 3 : 1.5) + '" stroke-dasharray="' + (open ? "" : "3 5") + '"/>';
      parts += '<a href="#/level/' + L.n + '" aria-label="Orbit ' + L.n + ' ' + L.key + (open ? "" : ", locked") + '"><circle cx="' + x + '" cy="' + y + '" r="15" fill="' + (open ? L.color : "var(--paper2)") + '" stroke="var(--ink)" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="700" fill="' + (open ? "#fff" : "var(--muted)") + '">' + (done ? "✓" : L.n) + "</text></a>";
    });
    parts += "</svg>";
    app.append(h("h1", {}, "Five orbits of practice"), h("p", { class: "muted" }, "Each orbit is a wider circle of influence. Clear all three missions in an orbit to open the next."),
      h("div", { class: "orbits" }, h("div", { html: parts }), h("div", {}, E.levels.map(function (L) {
        var gs = gamesOf(L.n), done = gs.filter(function (g) { return S.g[g.id] && S.g[g.id].p; }).length, open = unlocked(L.n);
        var a = h("a", { class: "card lvlcard" + (open ? "" : " locked"), href: open ? "#/level/" + L.n : "#/map", "aria-disabled": open ? null : "true" },
          h("div", { class: "lvlnum", style: "background:" + L.color }, String(L.n)),
          h("div", {}, h("b", {}, L.key + ": " + L.title), h("div", { class: "small muted" }, L.audience), h("div", { class: "bar", style: "margin-top:8px" }, h("i", { style: "width:" + (done / 3 * 100) + "%;background:" + L.color }))),
          h("span", { class: "pill " + (done === 3 ? "ok" : "") }, open ? done + "/3" : "Locked"));
        return a;
      }))));
  }

  /* ---------- Level ---------- */
  function level(n) {
    n = +n; var L = E.levels[n - 1]; if (!L) return go("#/map");
    if (!unlocked(n)) { app.append(h("div", { class: "card" }, h("h2", {}, "Orbit " + n + " is locked"), h("p", {}, "Complete all three missions in Orbit " + (n - 1) + " first."), h("a", { class: "btn", href: "#/map" }, "Back to orbits"))); return; }
    app.append(h("p", {}, h("a", { href: "#/map" }, "← All orbits")),
      h("span", { class: "pill", style: "background:" + L.color + ";color:#fff" }, "Orbit " + L.n + ": " + L.key), h("h1", { style: "margin-top:8px" }, L.title),
      h("p", { class: "muted" }, L.audience), h("p", {}, L.objective), h("p", { class: "muted" }, L.framing));
    app.append(h("div", { class: "grid g3" }, gamesOf(n).map(function (g) {
      var s = S.g[g.id] || {};
      return h("div", { class: "card gamecard" }, h("span", { class: "pill" }, "Mission " + g.id), h("h3", {}, g.title), h("p", { class: "small muted" }, g.goalText),
        h("div", { class: "small" }, g.learn.map(function (x) { return h("div", {}, "• " + x); })),
        h("div", { class: "meta" }, s.p ? h("span", { class: "pill ok" }, "Passed " + s.s) : s.t ? h("span", { class: "pill bad" }, "Best " + s.s) : h("span", { class: "pill" }, "New"), h("a", { class: "btn primary", href: "#/play/" + g.id }, s.t ? "Play again" : "Play")));
    })));
    if (levelDone(n)) app.append(h("div", { class: "carbon", style: "margin-top:16px" }, h("b", {}, "Orbit complete. "), "Your " + L.log + " is ready to export.", h("div", { class: "row", style: "margin-top:10px" }, h("a", { class: "btn primary", href: "#/portfolio" }, "Open e-portfolio"), n < 5 ? h("a", { class: "btn", href: "#/level/" + (n + 1) }, "Next orbit") : null)));
  }

  /* ---------- Play ---------- */
  function newRun(g) { return { c: 100, b: g.start.b, f: 0, w: 0, s: 50, good: 0, total: 0, sh: {}, m: {} }; }
  function svOf(g, r) {
    var b0 = g.ref.b0 || g.start.b, e0 = g.ref.e0 || 1, cost = 10 + 90 * clamp(Math.max(0, b0 - r.b) / b0, 0, 1.5), harm = 10 + 90 * clamp(r.f / e0, 0, 1.5);
    return (r.c + r.s) / (cost + harm);
  }
  function makeDash(g, r) {
    var cB = h("i"), bB = h("i"), fB = h("i"), cL = h("span"), bL = h("span"), fL = h("span"), sv = h("b"), ea = h("div", { class: "dashearth" });
    var unit = g.unit || "kg CO2e", bu = g.noMoney ? "effort" : "cr";
    var el = h("aside", { class: "card dash", "aria-label": "Sustainable Value dashboard" },
      h("div", { class: "row", style: "justify-content:space-between" }, h("b", {}, "Planet dashboard"), ea),
      h("div", { class: "gauge" }, h("label", {}, h("span", {}, "Clinical Health Integrity"), cL), h("div", { class: "bar" }, cB, h("div", { class: "mark", style: "left:80%", title: "80% floor" }))),
      h("div", { class: "gauge" }, h("label", {}, h("span", {}, g.noMoney ? "Effort budget" : "Clinic budget"), bL), h("div", { class: "bar" }, bB)),
      h("div", { class: "gauge" }, h("label", {}, h("span", {}, "Planetary footprint"), fL), h("div", { class: "bar" }, fB)),
      h("div", { class: "sv" }, h("span", { class: "small muted" }, "Sustainable Value"), sv));
    function update() {
      var b0 = g.ref.b0 || g.start.b, e0 = g.ref.e0 || 1;
      cB.style.width = clamp(r.c, 0, 100) + "%"; cB.style.background = r.c >= 80 ? "var(--leaf)" : "var(--clay)"; cL.textContent = Math.round(r.c) + "%";
      bB.style.width = clamp(r.b / b0 * 100, 0, 100) + "%"; bB.style.background = r.b >= 0 ? "var(--sun)" : "var(--clay)"; bL.textContent = Math.round(r.b) + " / " + b0 + " " + bu;
      fB.style.width = clamp(r.f / e0 * 100, 0, 100) + "%"; fB.style.background = "var(--clay)"; fL.textContent = fix(r.f, 1) + " " + unit + (r.w ? ", " + fix(r.w, 2) + " kg waste" : "");
      sv.textContent = fix(svOf(g, r), 1);
      ea.innerHTML = earth(1 - clamp(r.f / e0, 0, 1) * .8, clamp(r.f / e0, 0, 1), "mini");
    }
    update();
    return { el: el, update: update };
  }
  function play(id) {
    var g = G(id); if (!g) return go("#/map");
    if (!unlocked(g.level)) return go("#/level/" + g.level);
    var L = E.levels[g.level - 1];
    app.append(h("p", {}, h("a", { href: "#/level/" + g.level }, "← Orbit " + g.level)), h("span", { class: "pill", style: "background:" + L.color + ";color:#fff" }, "Mission " + g.id), h("h1", { style: "margin-top:8px" }, g.title),
      h("div", { class: "card" }, h("p", {}, g.brief), h("p", { class: "small" }, h("b", {}, "Your goal: "), g.goalText), h("div", { class: "small muted" }, "Skills: " + g.learn.join(", ")),
        h("div", { class: "row", style: "margin-top:12px" }, h("button", { class: "btn primary", id: "begin" }, "Begin mission"), h("label", { class: "small" }, "Untimed mode: ", h("b", {}, S.relaxed ? "on" : "off"), " (change on the home page)"))));
    document.getElementById("begin").onclick = function () { start(g); };
    document.getElementById("begin").focus();
  }
  function start(g) {
    var r = newRun(g), root = h("div", { class: "stage" }), dash = makeDash(g, r), done = false;
    var ctx = {
      g: g, run: r, root: root, relaxed: S.relaxed,
      apply: function (d) { r.c = clamp(r.c + (d.c || 0), 0, 100); r.b += d.b || 0; r.f += d.f || 0; r.w += d.w || 0; r.s = clamp(r.s + (d.s || 0), 0, 100); Object.keys(d.sh || {}).forEach(function (k) { r.sh[k] = (r.sh[k] || 0) + d.sh[k]; }); Object.keys(d.m || {}).forEach(function (k) { r.m[k] = (r.m[k] || 0) + d.m[k]; }); dash.update(); },
      set: function (o) { Object.keys(o).forEach(function (k) { r[k] = k === "c" ? clamp(o[k], 0, 100) : o[k]; }); dash.update(); },
      finish: function () { if (done) return; done = true; finishGame(g, r); }
    };
    app.innerHTML = "";
    app.append(h("p", {}, h("a", { href: "#/level/" + g.level }, "← Leave mission")), h("h2", {}, g.id + " " + g.title), h("div", { class: "play" }, dash.el, h("div", { class: "card" }, root)));
    cleanup = ENG[g.engine](ctx);
    dash.update();
  }

  /* ---------- Results ---------- */
  function finishGame(g, r) {
    var res = g.goal(r), clin = { label: "Clinical Health Integrity", value: Math.round(r.c) + "%", target: "≥ " + CFG.clinicalFloor + "%", ok: r.c >= CFG.clinicalFloor, att: r.c / 100 };
    var primary = res.metrics.reduce(function (a, m) { return a + m.att; }, 0) / res.metrics.length * 100, sv = svOf(g, r);
    var score = Math.round(.65 * primary + .2 * r.c + .15 * 100 * clamp(sv / 3, 0, 1));
    score = res.pass ? Math.max(70, Math.min(100, score)) : Math.min(69, score);
    var prev = S.g[g.id] || {}, key = g.id === "1.1" ? r.total ? r.wrong / r.total * 100 : null : g.id === "1.2" ? r.supCount : g.id === "3.1" ? (r.kmBase ? (1 - r.km / r.kmBase) * 100 : null) : null;
    var wasLevelDone = levelDone(g.level);
    var better = score >= (prev.s || 0);
    S.g[g.id] = { s: Math.max(prev.s || 0, score), p: !!(prev.p || res.pass), t: (prev.t || 0) + 1, k: better && key != null ? fix(key, 1) : prev.k };
    save();
    lastResult = { g: g, r: r, res: res, clin: clin, score: score, sv: sv, newLevel: !wasLevelDone && levelDone(g.level) };
    go("#/result");
  }
  function table(rows) {
    return h("table", {}, h("thead", {}, h("tr", {}, h("th", {}, "Benchmark"), h("th", {}, "Your result"), h("th", {}, "Target"), h("th", {}, ""))), h("tbody", {}, rows.map(function (m) { return h("tr", {}, h("td", {}, m.label), h("td", {}, h("b", {}, m.value)), h("td", {}, m.target), h("td", { class: m.ok ? "ok" : "no" }, m.ok ? "Met" : "Not yet")); })));
  }
  function lineChart(series, xs, w, hgt, yl) {
    var max = Math.max.apply(null, [].concat.apply([], series.map(function (s) { return s.v; }))) * 1.1 || 1, W = w || 420, H = hgt || 200, pl = 44, pb = 28, svg = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + yl + '">';
    svg += '<line x1="' + pl + '" y1="' + (H - pb) + '" x2="' + (W - 8) + '" y2="' + (H - pb) + '" stroke="var(--line)"/><text x="4" y="14" font-size="10" fill="var(--muted)">' + yl + "</text>";
    xs.forEach(function (x, i) { var X = pl + i * (W - pl - 14) / (xs.length - 1); svg += '<text x="' + X + '" y="' + (H - 10) + '" font-size="10" text-anchor="middle" fill="var(--muted)">' + x + "</text>"; });
    series.forEach(function (s) {
      var pts = s.v.map(function (v, i) { return [pl + i * (W - pl - 14) / (xs.length - 1), 20 + (1 - v / max) * (H - pb - 28)]; });
      svg += '<polyline fill="none" stroke="' + s.c + '" stroke-width="3" points="' + pts.map(function (p) { return p.join(","); }).join(" ") + '"/>';
      var l = pts[pts.length - 1]; svg += '<text x="' + (l[0] - 4) + '" y="' + (l[1] - 6) + '" font-size="10" text-anchor="end" fill="' + s.c + '" font-weight="700">' + s.n + " " + fix(s.v[s.v.length - 1], 0) + "</text>";
    });
    return svg + "</svg>";
  }
  function result() {
    if (!lastResult) return go("#/map");
    var L0 = lastResult, g = L0.g, r = L0.r, res = L0.res, L = E.levels[g.level - 1], K = CFG.kgCO2ePerKm;
    var gl = gamesOf(g.level), idx = gl.indexOf(g), nextG = gl[idx + 1];
    app.append(h("span", { class: "pill " + (res.pass ? "ok" : "bad") }, res.pass ? "Mission passed" : "Not yet, try again"), h("h1", { style: "margin-top:8px" }, g.id + " " + g.title),
      h("div", { class: "kpi" }, h("div", {}, "Score", h("b", {}, String(L0.score))), h("div", {}, "Sustainable Value", h("b", {}, fix(L0.sv, 1))), h("div", {}, "Footprint", h("b", {}, fix(r.f, 1) + " " + (g.unit || "kg CO2e")))),
      h("div", { class: "card" }, table(res.metrics.concat([L0.clin]))));
    if (res.lines && res.lines.filter(Boolean).length) app.append(h("div", { class: "fb" }, res.lines.filter(Boolean).map(function (x) { return h("div", {}, x); })));
    if (res.chart === "spiral") {
      var f = r.earlyTotal ? r.earlyGood / r.earlyTotal : 0, mid = [1, 1, 2, 2, 3], res_ = [2, 4, 7, 11, 16], you = mid.map(function (m, i) { return m + (res_[i] - m) * (1 - f); });
      app.append(h("div", { class: "card", html: "<h3>Your 40-year pathway (illustrative)</h3>" + lineChart([{ n: "Restorative cycle", v: res_.map(function (x) { return x * 8; }), c: "#c0562f" }, { n: "Your pathway", v: you.map(function (x) { return x * 8; }), c: "#2f7d4f" }], ["Age 20", "30", "40", "50", "60"], 420, 200, "Cumulative kg CO2e") + '<p class="small muted">Illustration of the restorative cycle idea, assuming about 8 kg CO2e per visit for travel and materials. Not a prediction for any patient.</p>' }));
    }
    if (g.id === "4.1") {
      var base = r.base / 12, months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      app.append(h("div", { class: "card", html: "<h3>12-month audit</h3>" + lineChart([{ n: "Baseline", v: months.map(function () { return base; }), c: "#c0562f" }, { n: "After actions", v: months.map(function (m) { return base * (1 - r.pct / 100 * Math.min(1, m / 3)); }), c: "#2f7d4f" }], months.map(function (m) { return "M" + m; }), 420, 200, "t CO2e per month") + '<p class="small muted">Interventions phase in over three months. Baseline is an illustrative 1,200 t per year.</p>' }));
    }
    if (!NOCARBON[g.id]) {
      var perSession = Math.max(0, (g.ref.e0 || 0) - r.f) * (g.kgPerUnit || 1), monthly = perSession * (g.scale || 1), km = monthly / K;
      app.append(h("div", { class: "carbon" }, h("b", {}, "Carbon impact calculator. "), g.id === "4.1" ? "Your plan abates about " + fix(perSession, 0) + " kg CO2e per year at facility level, similar to driving about " + fix(km, 0) + " km." :
        "Compared with the business-as-usual run of this scenario you avoided about " + fix(perSession, 1) + " kg CO2e. Repeated across " + (g.scale || 1) + " similar sessions a month that is about " + fix(monthly, 1) + " kg CO2e, roughly " + fix(km, 0) + " km of driving.",
        h("div", { class: "small muted" }, "Illustrative scaling using 0.253 kg CO2e per km from the framework example. Local factors will differ.")));
    }
    if (g.ev) app.append(h("p", { class: "small muted" }, "Evidence note: " + g.ev));
    var row = h("div", { class: "row", style: "margin-top:14px" }, h("a", { class: "btn" + (res.pass ? "" : " primary"), href: "#/play/" + g.id }, "Replay mission"));
    if (res.pass && nextG) row.append(h("a", { class: "btn primary", href: "#/play/" + nextG.id }, "Next mission: " + nextG.title));
    row.append(h("a", { class: "btn ghost", href: "#/level/" + g.level }, "Back to orbit " + g.level));
    app.append(row);
    if (L0.newLevel) app.append(h("div", { class: "carbon", style: "margin-top:16px" }, h("b", {}, "Orbit " + g.level + " complete. "), "Your " + L.log + " is unlocked in the e-portfolio." + (g.level < 5 ? " Orbit " + (g.level + 1) + " is now open." : " You have completed every orbit."), h("div", { class: "row", style: "margin-top:10px" }, h("a", { class: "btn primary", href: "#/portfolio" }, "Open e-portfolio"))));
  }

  /* ---------- E-portfolio ---------- */
  var PROMPTS = {
    1: ["Which waste stream did you misjudge most often, and what rule will you use next time?", "Name one action you will take in your next clinic session to cut incineration or single-use plastic.", "What does the Minamata Convention ask of dental teams in practice?"],
    2: ["Prevention: where did you avoid an operative procedure?", "Patient empowerment: what would you say to a patient to support self-care?", "Lean care: which step did you remove or merge?", "Low-carbon alternatives: where was a substitute genuinely better, and where was the evidence mixed?"],
    3: ["Summarise the travel saved and the safeguards you applied.", "Which environmental determinants would you add to your routine history, and how would you record them?", "Describe an antimicrobial stewardship decision you would defend to a colleague."],
    4: ["State the baseline, the target and the interventions you chose.", "What governance, risks and re-audit schedule would you set?", "How would your plan serve students, patients and the community at the same time?"],
    5: ["State your policy ask in one paragraph.", "Which stakeholders were hardest to align and what did you trade?", "How does your plan protect equity and access?"]
  };
  function cyrb(str) { var h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (var i = 0; i < str.length; i++) { var ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase(); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function logHTML(n) {
    var L = E.levels[n - 1], who = S.name || S.alias, date = new Date().toISOString().slice(0, 10), refl = S.refl[n] || [];
    var rows = gamesOf(n).map(function (g) { var s = S.g[g.id] || {}; return "<tr><td>" + g.id + " " + esc(g.title) + "</td><td>" + (s.s || 0) + "</td><td>" + (s.p ? "Passed" : "Not passed") + "</td><td>" + esc(g.goalText) + "</td></tr>"; }).join("");
    var body = JSON.stringify({ n: n, who: who, date: date, g: gamesOf(n).map(function (g) { return [g.id, (S.g[g.id] || {}).s || 0]; }), r: refl });
    var rp = PROMPTS[n].map(function (p, i) { return "<h3>" + esc(p) + "</h3><p>" + esc(refl[i] || "(not completed)").replace(/\n/g, "<br>") + "</p>"; }).join("");
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + esc(L.log) + ' | EcoBite</title><style>body{font:16px/1.55 Georgia,serif;max-width:780px;margin:32px auto;padding:0 20px;color:#14302b}h1{margin:.2em 0}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ccc;padding:6px;text-align:left;font-size:14px}h3{font-size:1rem;margin-bottom:.2em}.m{color:#566b66;font-size:13px}@media print{body{margin:0}}</style></head><body>' +
      "<p class='m'>EcoBite: The Planetary Practitioner</p><h1>" + esc(L.log) + "</h1><p><b>Orbit " + n + " " + esc(L.key) + ":</b> " + esc(L.title) + "<br><b>Practitioner:</b> " + esc(who) + "<br><b>Date:</b> " + date + "</p><h2>Simulation results</h2><table><tr><th>Mission</th><th>Score</th><th>Status</th><th>Benchmark</th></tr>" + rows + "</table><h2>Reflection</h2>" + rp +
      "<p class='m'>Integrity checksum: " + cyrb(body) + " (a tamper-evident checksum of the data above, not a cryptographic signature). Scenario values are teaching parameters and not clinical guidance.</p></body></html>";
  }
  function portfolio() {
    app.append(h("h1", {}, "E-portfolio and accreditation export"), h("p", { class: "muted" }, "Complete an orbit to unlock its log. Write your reflections, then download a print-ready file for your graduation portfolio."),
      h("div", { class: "card", style: "margin-bottom:14px" }, h("label", { for: "pn" }, h("b", {}, "Name for portfolio exports ")), h("input", { type: "text", id: "pn", value: S.name, placeholder: "Your full name (stays on this device)", oninput: function (e) { S.name = e.target.value; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (x) {} } })));
    E.levels.forEach(function (L) {
      var done = levelDone(L.n), refl = S.refl[L.n] || (S.refl[L.n] = []);
      var card = h("div", { class: "card", style: "margin-bottom:14px" }, h("div", { class: "row", style: "justify-content:space-between" }, h("h3", { style: "margin:0" }, "Orbit " + L.n + ": " + L.log), h("span", { class: "pill " + (done ? "ok" : "") }, done ? "Unlocked" : "Locked")));
      if (done) {
        PROMPTS[L.n].forEach(function (p, i) {
          var id = "r" + L.n + i, ta = h("textarea", { id: id, rows: 3 }); ta.value = refl[i] || ""; ta.addEventListener("input", function () { S.refl[L.n][i] = ta.value; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} });
          card.append(h("label", { for: id, style: "display:block;margin-top:10px;font-weight:700" }, p), ta);
        });
        card.append(h("div", { class: "row", style: "margin-top:12px" },
          h("button", { class: "btn primary", onclick: function () { var b = new Blob([logHTML(L.n)], { type: "text/html" }), a = h("a", { href: URL.createObjectURL(b), download: "EcoBite-Orbit" + L.n + "-" + L.log.replace(/\s+/g, "-") + ".html" }); document.body.append(a); a.click(); a.remove(); } }, "Download log (.html)"),
          h("button", { class: "btn", onclick: function () { var w = window.open("", "_blank"); if (w) { w.document.write(logHTML(L.n)); w.document.close(); w.focus(); setTimeout(function () { w.print(); }, 300); } } }, "Print or save as PDF")));
      } else card.append(h("p", { class: "muted small" }, "Pass all three missions in this orbit to unlock."));
      app.append(card);
    });
  }

  /* ---------- Leaderboard ---------- */
  function board() {
    var me = { alias: S.alias + " (you)", total: totalScore(), err: (S.g["1.1"] || {}).k, sup: (S.g["1.2"] || {}).k, trav: (S.g["3.1"] || {}).k, lv: [1, 2, 3, 4, 5].filter(levelDone).length, me: true };
    var seed = [["Cohort sample A", 86, 4.8, 17, 62, 4], ["Cohort sample B", 78, 4.8, 19, 55, 3], ["Cohort sample C", 71, 9.5, 20, 51, 3], ["Cohort sample D", 64, 9.5, 24, 44, 2], ["Cohort sample E", 52, 14.3, 26, 38, 1], ["Cohort sample F", 33, 19, 30, 22, 1]].map(function (x) { return { alias: x[0], total: x[1], err: x[2], sup: x[3], trav: x[4], lv: x[5] }; });
    var rows = seed.concat([me]).sort(function (a, b) { return b.total - a.total; });
    function c(x, s) { return x == null ? "n/a" : x + (s || ""); }
    app.append(h("h1", {}, "Anonymised cohort leaderboard"),
      h("div", { class: "fb" }, "Rows labelled Cohort sample are illustrative placeholders so the board is not empty. For a real cohort, your instructor reads your scores from the LMS gradebook, or configures an optional endpoint in js/config.js."),
      h("div", { class: "card" }, h("table", {}, h("thead", {}, h("tr", {}, ["Alias", "Planet Health Index", "Segregation error (1.1)", "SUP items (1.2)", "Travel saved (3.1)", "Orbits"].map(function (t) { return h("th", {}, t); }))),
        h("tbody", {}, rows.map(function (x) { return h("tr", { style: x.me ? "background:var(--leaf2)" : "" }, h("td", {}, x.alias), h("td", {}, h("b", {}, x.total)), h("td", {}, c(x.err, "%")), h("td", {}, c(x.sup)), h("td", {}, c(x.trav, "%")), h("td", {}, x.lv + "/5")); })))),
      h("div", { class: "row", style: "margin-top:12px" },
        h("button", { class: "btn", onclick: function () { var csv = "alias,planet_health_index,segregation_error_pct,sup_items,travel_saved_pct,orbits\n" + [me].map(function (x) { return [S.alias, x.total, x.err == null ? "" : x.err, x.sup == null ? "" : x.sup, x.trav == null ? "" : x.trav, x.lv].join(","); }).join("\n"); var a = h("a", { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "ecobite-my-results.csv" }); document.body.append(a); a.click(); a.remove(); } }, "Download my results (.csv)"),
        CFG.leaderboardEndpoint ? h("button", { class: "btn primary", onclick: function () { fetch(CFG.leaderboardEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ alias: S.alias, total: me.total, err: me.err, sup: me.sup, trav: me.trav, lv: me.lv }) }).then(function () { alert("Submitted anonymously."); }); } }, "Submit my anonymised result") : null));
  }

  /* ---------- About ---------- */
  function about() {
    var pv = h("input", { type: "checkbox", id: "pv" }); pv.checked = S.preview; pv.addEventListener("change", function () { S.preview = pv.checked; save(); });
    app.append(h("h1", {}, "How it works and the evidence"),
      h("div", { class: "grid g2" },
        h("div", { class: "card" }, h("h3", {}, "Design"), h("p", {}, "EcoBite is a serious simulation of five tiers: Novice, Intermediate, Advanced, Expert and Master. Each tier has three missions, 15 in total. A mission passes when its benchmark is met and Clinical Health Integrity stays at 80% or higher. Scores of 70 and above are passes."),
          h("p", {}, "Sustainable Value = (Clinical Outcomes + Social Impact) / (Financial Costs + Environmental Harm). The dashboard shows each term live.")),
        h("div", { class: "card" }, h("h3", {}, "Honest limits"), h("ul", {}, h("li", {}, "Scenario quantities are simplified teaching parameters, not measured data."), h("li", {}, "Benchmarks (5% error, 21 SUP items / 354 g, 64.5% travel, 71% Scope 3, 2034 amalgam target and others) come from the EcoBite framework document and should be verified against primary sources before external publication."), h("li", {}, "Digital versus analogue workflows and endocrine-disrupting chemical links to enamel defects have mixed or emerging evidence, and the game says so."), h("li", {}, "The carbon calculator scales results using 0.253 kg CO2e per km (the framework example). Local emission factors differ.")))),
      h("div", { class: "card", style: "margin-top:16px" }, h("h3", {}, "Core literature and regulatory references (from the framework)"), h("ul", {},
        h("li", {}, "Centre for Sustainable Healthcare. The four principles of sustainable healthcare and the SusQI framework. Oxford, UK."),
        h("li", {}, "Duane B et al. (2017). Environmental sustainability and dentistry: the carbon footprint of primary dental care. British Dental Journal, 223(7), 489 to 493."),
        h("li", {}, "FDI World Dental Federation (2022). Consensus statement on environmentally sustainable oral healthcare."),
        h("li", {}, "Planetary Health Report Card initiative. Metrics and evaluation framework (five domains: curriculum, research, community outreach and advocacy, student-led initiatives, campus sustainability)."),
        h("li", {}, "World Health Organization. Global Oral Health Action Plan 2023 to 2030."),
        h("li", {}, "UNEP. Minamata Convention on Mercury (dental amalgam measures); ISO 11143 (amalgam separators); ISO 23907 (sharps containers); Raworth K (2017) Doughnut Economics."))),
      h("div", { class: "card", style: "margin-top:16px" }, h("h3", {}, "Instructor and device options"),
        h("label", { class: "toggle", for: "pv" }, pv, h("span", {}, h("b", {}, "Preview mode: unlock every orbit"), h("br"), h("span", { class: "muted small" }, "For teaching and testing. Scores still save.")), h("span")),
        h("div", { class: "row", style: "margin-top:10px" }, h("button", { class: "btn", onclick: function () { if (confirm("Reset all progress on this device?")) { S = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} save(); go("#/home"); } } }, "Reset my progress"))));
  }

  window.ECOAPP = { S: function () { return S; }, go: go, start: start, finishGame: finishGame, G: G };
  vitals(); route();
})();

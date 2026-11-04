/* EcoBite mini-game engines. Each engine receives a context: {g, run, root, relaxed, apply, set, refresh, finish, h}. */
(function () {
  var _ap = Element.prototype.append;
  Element.prototype.append = function () { _ap.apply(this, [].slice.call(arguments).reduce(function (a, x) { return a.concat(x); }, []).filter(function (x) { return x != null && x !== false; })); };
})();
window.ENG = (function () {
  var E = window.ECO, ENG = {};
  function h(tag, props) {
    var e = document.createElement(tag), kids = Array.prototype.slice.call(arguments, 2);
    for (var k in (props || {})) {
      if (k === "class") e.className = props[k];
      else if (k === "html") e.innerHTML = props[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), props[k]);
      else if (props[k] !== false && props[k] != null) e.setAttribute(k, props[k]);
    }
    kids.flat().forEach(function (c) { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function fix(x, n) { return (Math.round(x * Math.pow(10, n || 1)) / Math.pow(10, n || 1)).toString(); }
  ENG.h = h; ENG.shuffle = shuffle; ENG.clamp = clamp;

  function progress(n, cur) { var d = h("div", { class: "prog", role: "img", "aria-label": "Step " + (cur + 1) + " of " + n }); for (var i = 0; i < n; i++) d.append(h("i", { class: i < cur ? "done" : i === cur ? "cur" : "" })); return d; }
  function feedback(kind, text, src) { return h("div", { class: "fb " + kind, role: "status" }, h("div", { html: text }), src ? h("div", { class: "src" }, "Evidence: " + src) : null); }

  /* ---------------- SORT ---------------- */
  ENG.sort = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, items = shuffle(g.items), i = 0, timer = null, locked = false;
    r.wrong = 0; r.total = 0; r.recycNo404 = 0;
    var why = { sw404: "Soiled with blood or saliva: infectious stream (SW404).", sharps: "Anything that can puncture goes in a rigid ISO 23907 sharps container.", blue: "Reusable or treatable items are reprocessed, not thrown away.", recycle: "Clean paper, card and glass: recycle it. Incinerating it wastes energy and money." };
    function show() {
      root.innerHTML = ""; locked = false;
      if (i >= items.length) return ctx.finish();
      var it = items[i];
      var tbar = h("div", { class: "bar timer", "aria-hidden": "true" }, h("i", { style: "width:100%;background:var(--sun)" }));
      var chip = h("div", { class: "item", draggable: "true", tabindex: "0", role: "text", "aria-label": "Item: " + it[0] }, it[0]);
      chip.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", "x"); });
      var fbBox = h("div", { "aria-live": "polite" });
      var bins = h("div", { class: "bins" }, g.bins.map(function (b, k) {
        var btn = h("button", { class: "bin", style: "border-color:" + b.color, "data-bin": b.id, onclick: function () { choose(b.id); } }, (k + 1) + ". " + b.name, h("small", {}, b.sub));
        btn.addEventListener("dragover", function (e) { e.preventDefault(); btn.classList.add("over"); });
        btn.addEventListener("dragleave", function () { btn.classList.remove("over"); });
        btn.addEventListener("drop", function (e) { e.preventDefault(); btn.classList.remove("over"); choose(b.id); });
        return btn;
      }));
      root.append(progress(items.length, i), h("p", { class: "muted small" }, "Item " + (i + 1) + " of " + items.length + ". Drag the item to a stream, click a stream, or press 1 to 4." + (ctx.relaxed ? "" : " Beat the clock.")),
        h("div", { style: "text-align:center;margin:18px 0" }, chip), ctx.relaxed ? null : tbar, bins, fbBox);
      if (!ctx.relaxed) {
        var t0 = Date.now(), T = 9000;
        timer = setInterval(function () {
          var p = 1 - (Date.now() - t0) / T; tbar.firstChild.style.width = Math.max(0, p * 100) + "%";
          if (p <= 0) { clearInterval(timer); choose(null); }
        }, 60);
      }
      function choose(bin) {
        if (locked) return; locked = true; clearInterval(timer);
        r.total++;
        var ok = bin === it[1], d = {};
        if (ok) { d = it[1] === "sw404" ? { f: 0.8, b: -1.5 } : { f: 0.1, b: -0.3 }; }
        else {
          r.wrong++;
          if (bin == null) d = { c: -3, f: 0.5 };
          else if (it[1] === "recycle" && bin === "sw404") { r.recycNo404++; d = { f: 1.2, b: -3, w: 0.05 }; }
          else if (it[1] === "recycle") d = { f: 0.8, b: -1 };
          else if (it[1] === "sharps") d = { c: -14, f: 0.5 };
          else if (it[1] === "sw404") d = { c: bin === "recycle" ? -12 : bin === "blue" ? -6 : -3, f: 0.5 };
          else if (it[1] === "blue") d = bin === "sw404" ? { f: 1.5, b: -3 } : { c: -6, f: 0.5 };
        }
        ctx.apply(d);
        var cls = ok ? "good" : "bad";
        fbBox.append(feedback(cls, (ok ? "<b>Correct.</b> " : "<b>" + (bin == null ? "Out of time. " : "Not quite. ") + "</b>") + why[it[1]]));
        root.querySelectorAll(".bin").forEach(function (b) { b.disabled = true; if (b.dataset.bin === it[1]) b.style.background = "var(--leaf2)"; });
        i++;
        var next = h("button", { class: "btn primary", onclick: show }, i >= items.length ? "See results" : "Next item");
        fbBox.append(next); next.focus();
        if (!ctx.relaxed) setTimeout(function () { if (document.body.contains(next)) show(); }, 1400);
      }
    }
    document.onkeydown = function (e) { var k = parseInt(e.key, 10); if (k >= 1 && k <= 4) { var b = root.querySelectorAll(".bin")[k - 1]; if (b && !b.disabled) b.click(); } else if (e.key === "Enter") { var n = root.querySelector(".btn.primary"); if (n) n.click(); } };
    show();
    return function () { clearInterval(timer); document.onkeydown = null; };
  };

  /* ---------------- POUCH + SUP ---------------- */
  ENG.pouch = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, i = 0, timer = null, locked = false;
    r.cleanTotal = g.pouches.filter(function (s) { return !s; }).length; r.divert = 0; r.unsafe = 0;
    function phaseA() {
      root.innerHTML = ""; locked = false;
      if (i >= g.pouches.length) return phaseB();
      var soiled = g.pouches[i];
      var tbar = h("div", { class: "bar timer", "aria-hidden": "true" }, h("i", { style: "width:100%;background:var(--sun)" }));
      var box = h("div", { "aria-live": "polite" });
      root.append(progress(g.pouches.length, i),
        h("h3", {}, "Phase A: pouch " + (i + 1) + " of " + g.pouches.length),
        h("p", { class: "muted" }, soiled ? "Status: this pouch was in the contaminated zone and has been splashed with blood." : "Status: opened before patient contact. The contents are in use, the pouch is unsoiled."),
        h("div", { class: "pouch" + (soiled ? " soiled" : "") }, h("div", { class: "paper" }, "PAPER"), h("div", { class: "film" }, "FILM")),
        h("div", { class: "row", style: "justify-content:center" },
          h("button", { class: "btn primary", onclick: function () { act("peel"); } }, "Peel: paper to recycling, film to clinical waste"),
          h("button", { class: "btn", onclick: function () { act("whole"); } }, "Whole pouch to Yellow SW404")),
        ctx.relaxed ? null : tbar, box);
      if (!ctx.relaxed) {
        var t0 = Date.now(), T = 9000;
        timer = setInterval(function () { var p = 1 - (Date.now() - t0) / T; tbar.firstChild.style.width = Math.max(0, p * 100) + "%"; if (p <= 0) { clearInterval(timer); act("whole", true); } }, 60);
      }
      function act(a, timeout) {
        if (locked) return; locked = true; clearInterval(timer);
        var msg, kind;
        if (!soiled && a === "peel") { r.divert++; ctx.apply({ f: 0.2, b: -0.3 }); msg = "Paper diverted to recycling. Only the film goes for treatment."; kind = "good"; }
        else if (!soiled) { ctx.apply({ f: 1.5, b: -2 }); msg = (timeout ? "Out of time. " : "") + "Clean paper was incinerated. Peel unsoiled pouches before use."; kind = "bad"; }
        else if (a === "whole") { ctx.apply({ f: 0.8, b: -1.5 }); msg = "Correct. Soiled packaging is infectious waste."; kind = "good"; }
        else { ctx.apply({ c: -15, f: 0.2 }); msg = "Soiled paper in recycling contaminates the stream and is a safety breach."; kind = "bad"; }
        root.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        box.append(feedback(kind, msg));
        i++; var n = h("button", { class: "btn primary", onclick: phaseA }, i >= g.pouches.length ? "Continue to SUP audit" : "Next pouch"); box.append(n); n.focus();
        if (!ctx.relaxed) setTimeout(function () { if (document.body.contains(n)) phaseA(); }, 1300);
      }
    }
    function phaseB() {
      var base = g.sup.reduce(function (a, x) { return a + x[1]; }, 0); r.supBase = base;
      var cA = r.c, bA = r.b, fA = r.f, sw = {};
      var summary = h("div", { class: "kpi" });
      var list = h("div");
      function upd() {
        var removed = 0, swaps = 0, unsafe = 0;
        g.sup.forEach(function (x, k) { if (sw[k]) { removed += x[1]; swaps++; if (!x[3]) unsafe++; } });
        r.supCount = base - removed; r.unsafe = unsafe;
        ctx.set({ c: cA - 12 * unsafe, b: bA - 1.5 * swaps, f: fA + r.supCount * 0.3 });
        summary.innerHTML = "";
        summary.append(h("div", {}, "SUP items", h("b", {}, String(r.supCount))), h("div", {}, "Target", h("b", {}, "< 21")), h("div", {}, "Approx. plastic mass", h("b", {}, Math.round(r.supCount * 354 / 21) + " g")));
      }
      root.innerHTML = "";
      root.append(h("h3", {}, "Phase B: single-use plastic audit"), h("p", { class: "muted" }, "Baseline set-up has " + base + " SUP items. Swap items for safer alternatives. Infection control must not be compromised. Pouch phase result: " + r.divert + " of " + r.cleanTotal + " clean pouch papers diverted."), summary, list,
        h("button", { class: "btn primary", onclick: function () { ctx.finish(); } }, "Submit audit"));
      g.sup.forEach(function (x, k) {
        var cb = h("input", { type: "checkbox", id: "sup" + k, "aria-label": "Swap " + x[0] });
        var row = h("label", { class: "toggle", for: "sup" + k }, cb, h("span", {}, h("b", {}, x[0] + " (" + x[1] + ")"), h("br"), h("span", { class: "muted small" }, "Swap: " + x[2])), h("span", { class: "pill" }, x[3] ? "swap" : "check safety"));
        cb.addEventListener("change", function () { sw[k] = cb.checked; row.classList.toggle("on", cb.checked); upd(); });
        list.append(row);
      });
      upd();
    }
    phaseA();
    return function () { clearInterval(timer); };
  };

  /* ---------------- SCENARIO ---------------- */
  ENG.scenario = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, idx = -1, raf = null;
    r.earlyTotal = 0; r.earlyGood = 0;
    var stakeBox = g.stake ? h("div", { class: "stake card" }) : null, metBox = g.metrics ? h("div", { class: "kpi" }) : null, body = h("div");
    function panels() {
      if (stakeBox) { stakeBox.innerHTML = ""; stakeBox.append(h("b", {}, "Stakeholder support (need " + (g.stakeMin === 60 ? "60" : g.stakeMin) + "+)"));
        g.stake.forEach(function (s) { var v = clamp(50 + (r.sh[s.id] || 0), 0, 100); var ok = v >= g.stakeMin;
          stakeBox.append(h("div", {}, h("span", {}, s.n), h("div", { class: "bar" }, h("i", { style: "width:" + v + "%;background:" + (ok ? "var(--leaf)" : "var(--clay)") })), h("b", {}, Math.round(v)))); }); }
      if (metBox) { metBox.innerHTML = ""; g.metrics.forEach(function (m) { var v = r.m[m.id] || 0; metBox.append(h("div", {}, m.label, h("b", {}, fix(v, 2) + " " + m.unit), h("span", { class: "small muted" }, "Target " + m.target + " " + m.unit))); }); }
    }
    function vis(k) { var s = g.steps[k]; return !(s.when && !s.when(r)); }
    function next() {
      cancelAnimationFrame(raf); idx++;
      while (idx < g.steps.length && !vis(idx)) idx++;
      if (idx >= g.steps.length) return ctx.finish();
      draw(g.steps[idx]);
    }
    function draw(st) {
      body.innerHTML = ""; panels();
      body.append(progress(g.steps.length, idx), h("h3", {}, st.title), h("p", {}, st.text));
      if (st.type === "fit") return fit(st);
      var box = h("div", { "aria-live": "polite" }), locked = false;
      shuffle(st.opts).forEach(function (o) {
        var b = h("button", { class: "opt", onclick: function () {
          if (locked) return; locked = true;
          r.total++; if (o.good) r.good++; if (st.early) { r.earlyTotal++; if (o.good) r.earlyGood++; }
          ctx.apply(o.d || {}); panels();
          body.querySelectorAll(".opt").forEach(function (x) { x.disabled = true; });
          b.classList.add(o.good ? "good" : "bad");
          box.append(feedback(o.good ? "good" : "bad", "<b>" + (o.good ? "Best option. " : "Think again. ") + "</b>" + o.fb, o.ev));
          if (!o.good) { var best = st.opts.filter(function (z) { return z.good; })[0]; if (best) box.append(h("p", { class: "small" }, h("b", {}, "Best option: "), best.t)); }
          var n = h("button", { class: "btn primary", onclick: next }, idx >= g.steps.length - 1 ? "See results" : "Continue"); box.append(n); n.focus();
        } }, o.t);
        body.append(b);
      });
      body.append(box);
    }
    function fit(st) {
      var tries = 3, best = null, t0 = performance.now(), locked = false, pos = 50, speed = ctx.relaxed ? 0.0009 : 0.002;
      var zoneW = 50 / 6; // percent for under 50 um at 6 um per percent
      var ret = h("div", { class: "ret" }), zone = h("div", { class: "zone", style: "left:" + (50 - zoneW) + "%;width:" + (2 * zoneW) + "%" });
      var track = h("div", { class: "fit", role: "img", "aria-label": "Moving reticle. Target margin in the centre." }, zone, h("div", { class: "tgt" }), ret);
      var out = h("div", { "aria-live": "polite" }), btn;
      function loop(t) { pos = 50 + 48 * Math.sin((t - t0) * speed); ret.style.left = pos + "%"; raf = requestAnimationFrame(loop); }
      raf = requestAnimationFrame(loop);
      btn = h("button", { class: "btn primary", onclick: function () {
        if (locked) return;
        var gap = Math.abs(pos - 50) * 6; tries--; best = best == null ? gap : Math.min(best, gap);
        out.innerHTML = ""; out.append(h("p", {}, "Gap: ", h("b", {}, Math.round(gap) + " µm"), gap < 50 ? " (within 50 µm)" : " (too wide)", ". Best so far: ", h("b", {}, Math.round(best) + " µm"), ". Attempts left: " + tries));
        if (best < 50 || tries <= 0) {
          locked = true; cancelAnimationFrame(raf); r.fitBest = best;
          if (best >= 50) ctx.apply({ c: -10 });
          ctx.apply({ f: 0.6, b: -4 });
          btn.disabled = true; var n = h("button", { class: "btn primary", onclick: next }, "See results"); out.append(n); n.focus();
        }
      } }, "Seat the restoration");
      body.append(track, btn, out, h("p", { class: "muted small" }, "Keyboard: press Space or Enter to seat. Untimed mode slows the reticle."));
    }
    root.append(stakeBox, metBox, body);
    next();
    return function () { cancelAnimationFrame(raf); };
  };

  /* ---------------- N2O ---------------- */
  ENG.n2o = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root;
    function kg(p, conc, flow, mins, leak) { return flow * conc / 100 * mins * 1.98 / 1000 * g.gwp * (leak ? 0.85 : 1); }
    var base = g.patients.reduce(function (a, p) { return a + kg(p, g.base.conc, g.base.flow, p.mins, false); }, 0);
    r.n2oBase = base; ctx.g.ref.e0 = base;
    var st = g.patients.map(function () { return { mode: "n2o", conc: 50, flow: 6 }; }), glob = { leak: false, crack: false }, sum = h("div"), rows = [];
    function calc() {
      var f = 0, c = 100, lines = [], b = g.start.b - (glob.leak ? 10 : 0) - (glob.crack ? 60 : 0);
      g.patients.forEach(function (p, k) {
        var s = st[k];
        if (s.mode === "bm") { c += p.bm.c; lines.push(p.name + ": " + p.bm.text); return; }
        f += kg(p, s.conc, s.flow, p.mins, glob.leak);
        if (s.conc > 70) { c -= 15; lines.push(p.name + ": less than 30% oxygen is unsafe."); }
        else if (s.conc < p.need[0]) { c -= 10; lines.push(p.name + ": under-sedated, the visit may fail and need repeating."); }
        else if (s.conc > p.need[1] + 10) { c -= 8; lines.push(p.name + ": over-sedated."); }
        if (s.flow < p.minFlow) { c -= 8; lines.push(p.name + ": flow below minute ventilation, the reservoir bag will collapse."); }
      });
      if (glob.crack) f *= 0.1;
      r.sedLines = lines.join(" ");
      ctx.set({ c: c, b: b, f: f });
      rows.forEach(function (x) { x.upd(); });
      sum.innerHTML = ""; sum.append(h("div", { class: "kpi" }, h("div", {}, "Emissions", h("b", {}, fix(f, 1) + " kg CO2e")), h("div", {}, "Default setting", h("b", {}, fix(base, 1) + " kg")), h("div", {}, "Reduction", h("b", {}, fix((1 - f / base) * 100, 1) + "%"))), lines.length ? h("div", { class: "fb bad" }, lines.map(function (l) { return h("div", {}, l); })) : null);
    }
    g.patients.forEach(function (p, k) {
      var s = st[k];
      var mode = h("select", { "aria-label": "Mode for " + p.name, onchange: function () { s.mode = mode.value; calc(); } }, h("option", { value: "n2o" }, "Use nitrous oxide"), h("option", { value: "bm" }, "Behaviour management only"));
      var cl = h("b"), fl = h("b");
      var conc = h("input", { type: "range", min: 10, max: 80, step: 5, value: s.conc, class: "slider", "aria-label": "N2O concentration for " + p.name, oninput: function () { s.conc = +conc.value; calc(); } });
      var flow = h("input", { type: "range", min: 2, max: 10, step: 1, value: s.flow, class: "slider", "aria-label": "Total flow for " + p.name, oninput: function () { s.flow = +flow.value; calc(); } });
      var ctl = h("div", {}, h("label", {}, "N2O concentration: ", cl, "%"), conc, h("label", {}, "Total flow: ", fl, " L/min"), flow);
      rows.push({ upd: function () { cl.textContent = s.conc; fl.textContent = s.flow; ctl.style.display = s.mode === "bm" ? "none" : "block"; } });
      root.append(h("div", { class: "card", style: "margin-bottom:12px" }, h("h3", {}, p.name), h("p", { class: "muted small" }, p.mins + " minute procedure. Typical effective range " + p.need[0] + " to " + p.need[1] + "% with at least " + p.minFlow + " L/min flow."), mode, ctl));
    });
    var leak = h("input", { type: "checkbox", id: "leak", onchange: function () { glob.leak = leak.checked; calc(); } }), crack = h("input", { type: "checkbox", id: "crack", onchange: function () { glob.crack = crack.checked; calc(); } });
    root.append(h("div", { class: "card" }, h("h3", {}, "Facility upgrades"),
      h("label", { class: "toggle", for: "leak" }, leak, h("span", {}, h("b", {}, "Leak test, scavenging check and well-fitting nasal masks"), h("br"), h("span", { class: "muted small" }, "Costs 10 credits. Cuts wasted gas by about 15%.")), h("span", { class: "pill" }, "-10")),
      h("label", { class: "toggle", for: "crack" }, crack, h("span", {}, h("b", {}, "Install a catalytic cracking unit on the exhaust"), h("br"), h("span", { class: "muted small" }, "Costs 60 credits. Breaks down about 90% of scavenged N2O in this model.")), h("span", { class: "pill" }, "-60"))),
      sum, h("button", { class: "btn primary", style: "margin-top:12px", onclick: function () { ctx.finish(); } }, "Run the clinic day"));
    calc();
    return function () {};
  };

  /* ---------------- CALENDAR ---------------- */
  ENG.calendar = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, K = window.ECO_CONFIG.kgCO2ePerKm;
    var colors = ["#2f7d4f", "#1d7c8c", "#b8862a", "#7a4fa3"];
    var st = g.patients.map(function (p) { return { merge: p.visits.map(function () { return false; }), tele: p.visits.map(function () { return false; }) }; });
    var kmBase = g.patients.reduce(function (a, p) { return a + p.km * 2 * p.visits.length; }, 0); r.kmBase = kmBase; g.ref.e0 = kmBase * K;
    var cal = h("div", { class: "cal" }), sum = h("div"), ctlBox = h("div");
    function blocks(k) {
      var p = g.patients[k], s = st[k], out = [], cur = null;
      p.visits.forEach(function (v, j) {
        if (s.tele[j]) { cur = null; return; }
        if (cur && s.merge[j]) { cur.m += v.m; cur.names.push(v.n); cur.gap = cur.gap || false; }
        else { cur = { m: v.m, names: [v.n], gap: !!v.gap, p: k }; out.push(cur); }
      });
      return out;
    }
    function calc() {
      var km = 0, c = 100, notes = [], visits = 0, all = [];
      g.patients.forEach(function (p, k) {
        var bl = blocks(k); km += p.km * 2 * bl.length; visits += bl.length;
        bl.forEach(function (b) { if (b.m > p.max) { c -= 8; notes.push(p.name + ": a " + b.m + " minute block exceeds the " + p.max + " minute tolerance."); } all.push(b); });
        p.visits.forEach(function (v, j) { if (st[k].tele[j] && !v.tele) { c -= 12; notes.push(p.name + ": '" + v.n + "' needs an in-person visit."); } });
      });
      var tele = st.reduce(function (a, s) { return a + s.tele.filter(Boolean).length; }, 0);
      r.km = km; r.c = c;
      ctx.set({ c: c, f: km * K, b: g.start.b - tele });
      // greedy calendar fill, 180 min per day
      var days = [0, 1, 2, 3, 4].map(function () { return { used: 0, items: [] }; }), last = {};
      all.forEach(function (b) {
        var d = last[b.p] == null ? 0 : (b.gap ? last[b.p] + 1 : last[b.p]);
        while (d < 5 && days[d].used + b.m > 180) d++;
        if (d >= 5) { notes.push("Calendar overflow for " + g.patients[b.p].name + "."); return; }
        days[d].used += b.m; days[d].items.push(b); last[b.p] = d;
      });
      cal.innerHTML = "";
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach(function (n, d) {
        cal.append(h("div", { class: "day" }, h("h4", {}, n), days[d].items.map(function (b) { return h("div", { class: "chip", style: "background:" + colors[b.p] }, g.patients[b.p].name.split(" ")[0] + ": " + b.m + " min"); }), h("div", { class: "cap" }, days[d].used + " / 180 min")));
      });
      r.calLines = notes.join(" ");
      sum.innerHTML = ""; sum.append(h("div", { class: "kpi" }, h("div", {}, "In-person visits", h("b", {}, visits + " / " + g.patients.reduce(function (a, p) { return a + p.visits.length; }, 0))), h("div", {}, "Patient travel", h("b", {}, Math.round(km) + " km")), h("div", {}, "Saved", h("b", {}, fix((1 - km / kmBase) * 100, 1) + "%"))), notes.length ? h("div", { class: "fb bad" }, notes.map(function (x) { return h("div", {}, x); })) : null);
    }
    g.patients.forEach(function (p, k) {
      var card = h("div", { class: "card", style: "margin-bottom:10px;border-left:6px solid " + colors[k] }, h("h3", {}, p.name), h("p", { class: "muted small" }, p.km + " km each way. Tolerates up to " + p.max + " minutes per visit."));
      p.visits.forEach(function (v, j) {
        var line = h("div", { class: "row small", style: "margin:4px 0" }, h("b", {}, v.n + " (" + v.m + " min)"));
        if (j > 0 && !v.gap) {
          var id = "m" + k + "_" + j, cb = h("input", { type: "checkbox", id: id, onchange: function () { st[k].merge[j] = cb.checked; calc(); } });
          line.append(h("label", { for: id }, cb, " merge with previous"));
        } else if (j > 0) line.append(h("span", { class: "pill sun" }, "lab or healing gap, cannot merge"));
        var id2 = "t" + k + "_" + j, cb2 = h("input", { type: "checkbox", id: id2, onchange: function () { st[k].tele[j] = cb2.checked; calc(); } });
        line.append(h("label", { for: id2 }, cb2, " teledentistry"));
        card.append(line);
      });
      ctlBox.append(card);
    });
    root.append(h("div", { class: "grid g2" }, ctlBox, h("div", {}, h("h3", {}, "Clinic week"), cal, sum, h("button", { class: "btn primary", style: "margin-top:12px", onclick: function () { ctx.finish(); } }, "Confirm the care pathways"))));
    calc();
    return function () {};
  };

  /* ---------------- INTERVIEW ---------------- */
  ENG.interview = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, asked = {}, left = g.limit; r.drv = {}; r.found = 0;
    var qBox = h("div"), log = h("div", { "aria-live": "polite" }), drvBox = h("div", { class: "card" });
    function upd() {
      drvBox.innerHTML = ""; drvBox.append(h("b", {}, "Risk drivers found: " + r.found + " / 5"));
      Object.keys(g.drivers).forEach(function (k) { drvBox.append(h("div", { class: "small", style: "margin-top:6px;opacity:" + (r.drv[k] ? 1 : .45) }, (r.drv[k] ? "✓ " : "○ ") + (r.drv[k] ? g.drivers[k] : "Not yet found"))); });
      qBox.querySelectorAll("button").forEach(function (b) { if (!b.dataset.done) b.disabled = left <= 0; });
    }
    root.append(h("p", {}, g.intro), h("p", { class: "muted" }, "Questions left: ", h("b", { id: "qleft" }, String(left))), qBox, log, drvBox,
      h("button", { class: "btn primary", style: "margin-top:12px", onclick: function () { ctx.finish(); } }, "Finish consultation"));
    g.qs.forEach(function (q, k) {
      var b = h("button", { class: "opt", onclick: function () {
        if (asked[k] || left <= 0) return; asked[k] = true; left--; b.dataset.done = "1"; b.disabled = true; b.classList.add(q.driver ? "good" : "");
        root.querySelector("#qleft").textContent = left;
        ctx.apply({ b: -3 });
        if (q.driver && !r.drv[q.driver]) { r.drv[q.driver] = true; r.found++; }
        log.prepend(h("div", { class: "fb " + (q.driver ? "good" : "") }, h("b", {}, q.q), h("div", {}, "“" + q.a + "”"), q.driver ? h("div", { class: "src" }, "Environmental risk driver identified.") : h("div", { class: "src" }, "No environmental driver here.")));
        upd();
      } }, q.q);
      qBox.append(b);
    });
    upd();
    return function () {};
  };

  /* ---------------- ALLOCATE (4.1 and 4.3) ---------------- */
  ENG.allocate = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, sel = {}, sum = h("div"), groups = {};
    var is43 = g.id === "4.3";
    function calc() {
      var spent = 0, c = 100, s = 0;
      g.items.forEach(function (it) { if (sel[it.id] && !it.reinvest) spent += it.cost; });
      if (is43) {
        var pts = {}, mx = {}, tot = 0, totMax = 0;
        g.items.forEach(function (it) { mx[it.grp] = (mx[it.grp] || 0) + it.pts; totMax += it.pts; });
        g.items.forEach(function (it) { if (sel[it.id] && !it.needs) pts[it.grp] = (pts[it.grp] || 0) + it.pts; });
        g.items.forEach(function (it) { if (sel[it.id] && it.needs) { if ((pts[it.needs.grp] || 0) >= it.needs.pts) pts[it.grp] = (pts[it.grp] || 0) + it.pts; } });
        var doms = Object.keys(mx), allHalf = true;
        doms.forEach(function (d) { tot += pts[d] || 0; if ((pts[d] || 0) < mx[d] / 2) allHalf = false; });
        var pct = tot / totMax * 100;
        r.pctPts = pct; r.grade = pct >= 70 && allHalf ? "A" : pct >= 55 ? "B" : pct >= 40 ? "C" : "D";
        r.over = spent - g.start.b;
        r.domLines = doms.map(function (d) { return d + ": " + (pts[d] || 0) + "/" + mx[d]; }).join(". ") + ".";
        ctx.set({ c: 100, b: g.start.b - spent, f: 10 * (1 - pct / 100) });
        sum.innerHTML = ""; sum.append(h("div", { class: "kpi" }, h("div", {}, "Provisional grade", h("b", {}, r.grade)), h("div", {}, "Points", h("b", {}, Math.round(pct) + "%")), h("div", {}, "Effort left", h("b", {}, String(g.start.b - spent)))),
          h("div", { class: "small muted" }, r.domLines), r.over > 0 ? h("div", { class: "fb bad" }, "Over budget by " + r.over + ". Remove an action.") : null);
        return;
      }
      var pool = 0, pct41 = 0, offs = false, haptic = false, note = "";
      g.items.forEach(function (it) { if (sel[it.id]) { pool += it.save; if (it.c) c += it.c; } });
      g.items.forEach(function (it) {
        if (!sel[it.id]) return;
        if (it.reinvest) { if (pool >= it.cost) { haptic = true; pct41 += it.co2; s += it.s || 0; } else note = "The haptic suite needs " + it.cost + " credits of savings, you have " + pool + "."; }
        else if (it.offset) { offs = true; } else pct41 += it.co2;
      });
      r.pct = Math.min(100, pct41); r.pool = pool; r.haptic = haptic; r.base = g.base; r.over = spent - g.start.b; r.offsetNote = offs ? "Carbon offsets were selected but are not counted as a net reduction. Reduce at source first." : "";
      r.auditSel = JSON.parse(JSON.stringify(sel));
      ctx.set({ c: clamp(c, 0, 100), b: g.start.b - spent, f: g.base * (1 - r.pct / 100), s: 50 + s });
      sum.innerHTML = ""; sum.append(h("div", { class: "kpi" }, h("div", {}, "Net reduction", h("b", {}, fix(r.pct, 1) + "%")), h("div", {}, "Savings pool", h("b", {}, pool + " cr")), h("div", {}, "Budget left", h("b", {}, String(g.start.b - spent)))),
        note ? h("div", { class: "fb bad" }, note) : null, r.over > 0 ? h("div", { class: "fb bad" }, "Over budget by " + r.over + ". Remove an intervention.") : null);
    }
    g.items.forEach(function (it) {
      if (!groups[it.grp]) { groups[it.grp] = h("div", { class: "card", style: "margin-bottom:10px" }, h("h3", {}, it.grp)); root.append(groups[it.grp]); }
      var id = "a_" + it.id, cb = h("input", { type: "checkbox", id: id });
      var row = h("label", { class: "toggle", for: id }, cb, h("span", {}, h("b", {}, it.name), h("br"), h("span", { class: "muted small" }, it.desc)),
        h("span", { class: "pill" }, it.reinvest ? "from savings: " + it.cost : (is43 ? it.cost + " effort" : it.cost + " cr")));
      cb.addEventListener("change", function () { sel[it.id] = cb.checked; row.classList.toggle("on", cb.checked); calc(); });
      groups[it.grp].append(row);
    });
    var go = h("button", { class: "btn primary", style: "margin-top:12px", onclick: function () { if (r.over > 0) { sum.append(h("div", { class: "fb bad" }, "Reduce your selection to fit the budget first.")); return; } ctx.finish(); } }, is43 ? "Submit for PHRC grading" : "Run the 12-month audit");
    root.append(h("div", { class: "card" }, sum, go));
    calc();
    return function () {};
  };

  /* ---------------- DOUGHNUT ---------------- */
  ENG.doughnut = function (ctx) {
    var g = ctx.g, r = ctx.run, root = ctx.root, pick = g.decisions.map(function () { return -1; });
    var ns = "http://www.w3.org/2000/svg", RIN = 52, ROUT = 96, RMAX = 132;
    var svgWrap = h("div"), sum = h("div");
    function pol(rad, a) { return [Math.cos(a) * rad, Math.sin(a) * rad]; }
    function sector(r0, r1, a0, a1) { var p1 = pol(r1, a0), p2 = pol(r1, a1), p3 = pol(r0, a1), p4 = pol(r0, a0); return "M" + p1 + "A" + r1 + "," + r1 + " 0 0 1 " + p2 + "L" + p3 + (r0 > 0 ? "A" + r0 + "," + r0 + " 0 0 0 " + p4 : "") + "Z"; }
    function vals() {
      var S = g.dimsS.map(function (d) { return d.v; }), Ev = g.dimsE.map(function (d) { return d.v; }), spent = 0, trap = false;
      pick.forEach(function (k, i) { if (k < 0) return; var o = g.decisions[i].o[k]; spent += o.cost; o.d.forEach(function (x, j) { if (j < 4) S[j] += x; else Ev[j - 4] += x; }); if (o.d[1] <= -12) trap = true; });
      return { S: S, E: Ev, spent: spent, trap: trap };
    }
    function draw() {
      var v = vals();
      r.dimsS = g.dimsS.map(function (d, i) { return { n: d.n, v: v.S[i] }; }); r.dimsE = g.dimsE.map(function (d, i) { return { n: d.n, v: v.E[i] }; });
      r.over = v.spent - g.start.b;
      var q = v.S[1], c = q >= 60 ? 100 : 100 - (60 - q) * 2; r.unsafeNote = v.trap ? "Skipping surface disinfection compromised patient safety." : "";
      ctx.set({ c: clamp(c, 0, 100), b: g.start.b - v.spent, f: v.E.reduce(function (a, x) { return a + x; }, 0) / 4 });
      var svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", "-215 -160 430 320"); svg.setAttribute("class", "doughnut"); svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Doughnut economics chart. Social: " + r.dimsS.map(function (d) { return d.n + " " + d.v; }).join(", ") + ". Ecological: " + r.dimsE.map(function (d) { return d.n + " " + d.v; }).join(", "));
      function add(tag, attrs, txt) { var e = document.createElementNS(ns, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt) e.textContent = txt; svg.appendChild(e); return e; }
      add("circle", { r: RMAX, fill: "none", stroke: "var(--line)", "stroke-dasharray": "3 4" });
      add("path", { d: sector(RIN, ROUT, 0, Math.PI * 2 - 0.001), fill: "var(--leaf2)", opacity: .75 });
      add("circle", { r: RIN, fill: "none", stroke: "var(--ocean)", "stroke-width": 2, "stroke-dasharray": "5 3" });
      add("circle", { r: ROUT, fill: "none", stroke: "var(--clay)", "stroke-width": 2 });
      var n = 8, step = Math.PI * 2 / n;
      for (var i = 0; i < n; i++) {
        var social = i < 4, val = social ? v.S[i] : v.E[i - 4], a0 = -Math.PI / 2 + i * step + 0.03, a1 = a0 + step - 0.06, dim = social ? g.dimsS[i] : g.dimsE[i - 4], ok, r1, r0;
        if (social) { r0 = 0; r1 = Math.min(RMAX, val <= 60 ? val / 60 * RIN : RIN + (val - 60) / 40 * (RMAX - RIN)); ok = val >= 60; }
        else { r0 = RIN; r1 = Math.min(RMAX + 10, RIN + val / 60 * (ROUT - RIN)); ok = val <= 60; }
        add("path", { d: sector(r0, Math.max(r1, r0 + 1), a0, a1), fill: ok ? (social ? "var(--ocean)" : "var(--leaf)") : "var(--clay)", opacity: .9 });
        var m = (a0 + a1) / 2, lp = pol(RMAX + 12, m);
        add("text", { x: lp[0], y: lp[1], "font-size": 9, "text-anchor": Math.abs(Math.cos(m)) < .3 ? "middle" : (Math.cos(m) > 0 ? "start" : "end"), fill: "var(--ink)", "font-weight": 700 }, dim.n + " " + Math.round(val));
      }
      svgWrap.innerHTML = ""; svgWrap.appendChild(svg);
      sum.innerHTML = ""; sum.append(h("div", { class: "kpi" }, h("div", {}, "Social foundation", h("b", {}, v.S.filter(function (x) { return x >= 60; }).length + " / 4")), h("div", {}, "Ecological ceilings", h("b", {}, v.E.filter(function (x) { return x <= 60; }).length + " / 4")), h("div", {}, "Budget left", h("b", {}, String(g.start.b - v.spent)))),
        r.over > 0 ? h("div", { class: "fb bad" }, "Over budget by " + r.over + ".") : null);
    }
    var left = h("div");
    g.decisions.forEach(function (d, i) {
      var card = h("div", { class: "card", style: "margin-bottom:10px" }, h("h3", {}, d.t));
      d.o.forEach(function (o, k) {
        var id = "d" + i + "_" + k, rb = h("input", { type: "radio", name: "dec" + i, id: id });
        var row = h("label", { class: "toggle", for: id }, rb, h("span", {}, o.t), h("span", { class: "pill" }, o.cost + " cr"));
        rb.addEventListener("change", function () { pick[i] = k; card.querySelectorAll(".toggle").forEach(function (t) { t.classList.remove("on"); }); row.classList.add("on"); draw(); });
        card.append(row);
      });
      left.append(card);
    });
    root.append(h("div", { class: "grid g2" }, left, h("div", { style: "position:sticky;top:76px;align-self:start" }, h("div", { class: "card" }, svgWrap, h("p", { class: "small muted" }, "Dashed inner ring: social foundation minimum (60). Solid outer ring: ecological ceiling (60). Blue wedges (centre out) are social dimensions, green wedges are ecological pressures. Red means a breach."), sum,
      h("button", { class: "btn primary", onclick: function () { if (r.over > 0) return; ctx.finish(); } }, "Submit clinic plan")))));
    draw();
    return function () {};
  };
  return ENG;
})();

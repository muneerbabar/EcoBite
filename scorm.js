/* Minimal SCORM 1.2 runtime wrapper with a safe stand-alone fallback (GitHub Pages, local file, any web host). */
window.Scorm = (function () {
  var api = null, active = false, started = Date.now(), finished = false;
  function findAPI(win) {
    var n = 0;
    while (win && !win.API && win.parent && win.parent !== win && n < 10) { win = win.parent; n++; }
    return win && win.API ? win.API : null;
  }
  function init() {
    try {
      api = findAPI(window) || (window.opener ? findAPI(window.opener) : null);
      if (api) {
        var r = api.LMSInitialize("");
        active = (r === true || r === "true");
        if (active) {
          var st = get("cmi.core.lesson_status");
          if (!st || st === "not attempted") set("cmi.core.lesson_status", "incomplete");
        }
      }
    } catch (e) { active = false; }
    return active;
  }
  function get(k) { try { return active ? api.LMSGetValue(k) : ""; } catch (e) { return ""; } }
  function set(k, v) { try { return active ? api.LMSSetValue(k, String(v)) : false; } catch (e) { return false; } }
  function commit() { try { return active ? api.LMSCommit("") : false; } catch (e) { return false; } }
  function pad(n, l) { n = String(n); while (n.length < l) n = "0" + n; return n; }
  function sessionTime() {
    var s = Math.floor((Date.now() - started) / 1000);
    return pad(Math.floor(s / 3600), 4) + ":" + pad(Math.floor((s % 3600) / 60), 2) + ":" + pad(s % 60, 2);
  }
  function finish() {
    if (!active || finished) return;
    finished = true;
    set("cmi.core.session_time", sessionTime());
    commit();
    try { api.LMSFinish(""); } catch (e) {}
  }
  window.addEventListener("beforeunload", finish);
  window.addEventListener("pagehide", finish);
  return {
    init: init, get: get, set: set, commit: commit, finish: finish,
    isActive: function () { return active; },
    learnerName: function () { return active ? get("cmi.core.student_name") : ""; },
    report: function (o) {
      if (!active) return;
      set("cmi.core.score.min", 0);
      set("cmi.core.score.max", 100);
      set("cmi.core.score.raw", o.score);
      set("cmi.core.lesson_status", o.status);
      if (o.location) set("cmi.core.lesson_location", String(o.location).slice(0, 255));
      if (o.suspend) set("cmi.suspend_data", String(o.suspend).slice(0, 4090));
      set("cmi.core.session_time", sessionTime());
      commit();
    },
    suspendData: function () { return active ? get("cmi.suspend_data") : ""; }
  };
})();

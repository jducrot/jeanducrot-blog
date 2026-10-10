(function () {
  var b = document.getElementById("theme");
  if (!b) return;
  var root = document.documentElement;
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function sync() { b.setAttribute("aria-pressed", current() === "dark" ? "true" : "false"); }
  b.hidden = false;
  sync();
  b.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
})();

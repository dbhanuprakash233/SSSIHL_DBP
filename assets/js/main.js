// Progressive enhancement only — the site is fully usable with this disabled.
document.addEventListener("DOMContentLoaded", function () {
  // Highlight current nav link based on path, as a fallback when server-rendered
  // 'active' class isn't already present (kept simple: no-op if already set).
  var links = document.querySelectorAll(".main-nav a");
  var here = window.location.pathname.split("/").pop() || "index.html";
  links.forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop().split("#")[0];
    if (href === here && !a.classList.contains("active")) {
      a.classList.add("active");
    }
  });
});

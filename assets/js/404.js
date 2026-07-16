'use strict';
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var path = location.pathname || '/mystery';
  try { path = decodeURIComponent(path); } catch (err) { /* 保留原始路徑 */ }
  if (path.length > 60) path = path.slice(0, 57) + '…';

  var cmdEl = document.getElementById('err-cmd');
  var outEl = document.getElementById('err-out');
  var cursorEl = document.getElementById('err-typing-cursor');
  document.querySelectorAll('.err-path').forEach(function (el) { el.textContent = path; });

  var cmd = 'cd ' + path;
  function finish() {
    cmdEl.textContent = cmd;
    cursorEl.hidden = true;
    outEl.hidden = false;
  }
  if (reduced) { finish(); return; }

  var i = 0;
  (function type() {
    cmdEl.textContent = cmd.slice(0, ++i);
    if (i < cmd.length) { setTimeout(type, 50); } else { setTimeout(finish, 400); }
  })();
})();

(function () {
  "use strict";
  var C = window.SITE_CONFIG || {}, D = window.CATALOG, $ = function (s, r) { return (r || document).querySelector(s); },
      $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var fmt = function (n) { return Number(n).toLocaleString("en-US"); };
  var SITE = C.SITE_URL || (location.origin + location.pathname);
  var params = new URLSearchParams(location.search);
  if (params.get("ref")) try { sessionStorage.setItem("ref", params.get("ref")); } catch (e) {}

  $$(".js-count").forEach(function (el) { el.textContent = D.count; });
  if (C.CONTACT_EMAIL) $$(".js-contact").forEach(function (a) { a.href = "mailto:" + C.CONTACT_EMAIL; a.textContent = C.CONTACT_EMAIL; });

  /* ── Beta buttons: TestFlight if the link exists, otherwise the email form ── */
  var TF = (C.TESTFLIGHT_URL || "").trim();
  $$(".js-tf, .js-beta").forEach(function (a) {
    if (TF) { a.href = TF; a.target = "_blank"; a.rel = "noopener"; }
    else a.addEventListener("click", function (e) {
      e.preventDefault();
      var f = $("#join"); f.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () { $("input[type=email]", f).focus({ preventScroll: true }); }, 450);
      say(f, "The public TestFlight link opens soon. Leave your email and it's the first thing you'll get.", "");
    });
  });
  if (C.APP_STORE_URL) $$(".js-appstore").forEach(function (a) { a.hidden = false; a.href = C.APP_STORE_URL; });
  if (TF) $$(".js-when").forEach(function (p) { p.textContent = "Now. On your iPhone, tap \u201cJoin the TestFlight beta\u201d. TestFlight is Apple's free app for testing new apps, and it walks you through the rest."; });

  /* ── Gallery ── */
  var esbSvg = "";
  var tiles = D.items.slice();
  tiles.sort(function (a, b) { return a.durationInDays - b.durationInDays; });
  var grid = $(".js-grid");
  tiles.forEach(function (a) {
    var b = document.createElement("button");
    b.className = "tile" + (a.hl ? " hl" : ""); b.type = "button";
    b.innerHTML = (a.hl ? '<span class="esbt">' + esbSvg + "</span>" : '<img loading="lazy" src="' + a.img + '" alt="">') +
      '<span class="cap"><span class="d">' + esc(a.durationText) + '</span><span class="t">' + esc(a.name) + "</span></span>";
    b.setAttribute("aria-label", a.name + ", " + a.durationText);
    b.addEventListener("click", function () { openSheet(a); });
    grid.appendChild(b);
  });
  var sheet = $(".js-sheet");
  function clean(s) { return String(s || "").replace(/User:\S+\s+/g, "").replace(/\s{2,}/g, " ").trim(); }
  function credit(a) {
    if (a.hl) return "Illustration: original drawing, not a photograph.";
    var who = clean(a.imageAuthor); who = (!who || who === "unattributed") ? "Unattributed" : who;
    return "Photo: " + esc(who) + " \u00b7 " + esc(a.imageLicense) + ' \u00b7 <a href="' + esc(a.imageSourceURL) + '" target="_blank" rel="noopener">source</a>';
  }
  function openSheet(a) {
    var img = $(".js-sheet-img"); img.hidden = !!a.hl; if (!a.hl) img.src = a.img;
    $(".js-sheet-cat").textContent = a.category; $(".js-sheet-name").textContent = a.name;
    $(".js-sheet-days").textContent = a.durationText; $(".js-sheet-detail").textContent = a.detail;
    $(".js-sheet-credit").innerHTML = credit(a);
    sheet.hidden = false; $(".js-sheet-close").focus();
  }
  function closeSheet() { sheet.hidden = true; }
  $(".js-sheet-close").addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });
  $(".js-credits").innerHTML = D.items.map(function (a) { return "<li>" + esc(a.name) + ": " + credit(a) + "</li>"; }).join("");

  /* ── "How long is yours?" ── */
  var daysIn = $(".js-days"), out = $(".js-calc-out"), list = $(".js-calc-list"), last = null;
  function li(a) { return '<li><span class="cd">' + fmt(a.durationInDays) + 'd</span><span class="cn">' + esc(a.name) +
      '</span><span class="cx">' + esc(a.category) + " \u00b7 " + esc(a.durationText) + "</span></li>"; }
  function fit() { daysIn.style.width = (Math.max(1, String(daysIn.value).length) + 0.35) + "ch"; }
  function calc() {
    fit();
    var n = Math.max(1, Math.min(20000, parseInt(daysIn.value, 10) || 0)), all = D.items, total = all.length;
    var done = all.filter(function (a) { return a.durationInDays <= n; }), pick;
    var longest = all[total - 1], shortest = all[0];
    if (!parseInt(daysIn.value, 10)) { out.innerHTML = ""; list.innerHTML = ""; return; }
    if (n >= longest.durationInDays) {
      out.innerHTML = "All <b>" + total + "</b> missions in the Technology gallery were finished in <b>" + fmt(n) + " days</b> or less. The longest:";
      pick = all.slice(-3).reverse();
    } else if (!done.length) {
      out.innerHTML = "The fastest mission in the gallery took <b>" + esc(shortest.durationText) + "</b>. The next few:";
      pick = all.slice(0, 3);
    } else {
      out.innerHTML = "<b>" + done.length + "</b> of the gallery's " + total + " missions were finished in <b>" + fmt(n) + " days</b> or less. The closest to yours:";
      pick = all.slice().sort(function (a, b) { return Math.abs(a.durationInDays - n) - Math.abs(b.durationInDays - n); }).slice(0, 3)
        .sort(function (a, b) { return a.durationInDays - b.durationInDays; });
    }
    list.innerHTML = pick.map(li).join(""); last = { n: n, a: pick[0] };
    $$(".presets button").forEach(function (b) { b.classList.toggle("on", +b.dataset.d === n); });
  }
  daysIn.addEventListener("input", calc);
  $$(".presets button").forEach(function (b) { b.addEventListener("click", function () { daysIn.value = b.dataset.d; calc(); }); });
  calc();
  $(".js-calc-share").addEventListener("click", function () {
    if (!last) return;
    var text = last.a.name + " took " + last.a.durationText + ". What will you do in " + fmt(last.n) + " days?";
    share(text, shareUrl("calc"));
  });

  /* ── Referral link: ?ref=<code> rides along on every signup ── */
  function myCode() {
    try { var c = localStorage.getItem("myref"); if (!c) { c = Math.random().toString(36).slice(2, 8); localStorage.setItem("myref", c); } return c; }
    catch (e) { return "web"; }
  }
  function shareUrl(src) { return SITE + "?ref=" + myCode() + (src ? "&utm_source=share&utm_content=" + src : ""); }
  function share(text, url) {
    if (navigator.share) navigator.share({ title: "410 Days", text: text, url: url }).catch(function () {});
    else copy(text + " " + url);
  }
  function copy(s) { (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(function () { toast("Copied"); }, function () { prompt("Copy this:", s); }); }
  function toast(s) { var t = document.createElement("div"); t.textContent = s; t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0E1A33;color:#E9DCC4;padding:10px 16px;border-radius:999px;z-index:99;font:600 14px Inter"; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1600); }

  /* ── Signup ── */
  function say(form, text, cls) { var m = $(".msg", form); m.textContent = text; m.className = "msg " + (cls || ""); }
  function mailto(email, starting) {
    var to = C.CONTACT_EMAIL || "gordon@liang.ca";
    var body = "Please add me to the 410 Days iPhone beta.\n\nEmail: " + email + (starting ? "\nWhat I'm starting: " + starting : "") +
      "\nRef: " + (sessionStorage.getItem("ref") || "-");
    return "mailto:" + to + "?subject=" + encodeURIComponent("Add me to the 410 Days beta") + "&body=" + encodeURIComponent(body);
  }
  function thanks() {
    var d = $(".js-thanks"), link = shareUrl("signup");
    if (TF) { $(".js-thanks-title").textContent = "You're in. Install the beta now."; var b = $(".js-thanks-tf"); b.hidden = false; b.href = TF; b.target = "_blank"; }
    $(".js-ref-link").value = link;
    var text = "I'm trying 410 Days, a journal that puts what you're working on next to how long great feats of technology actually took.";
    $(".js-share-x").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(link);
    $(".js-share-li").href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(link);
    $(".js-share-sms").href = "sms:?&body=" + encodeURIComponent(text + " " + link);
    $(".js-copy").onclick = function () { copy(link); };
    $(".js-native-share").hidden = !navigator.share;
    $(".js-native-share").onclick = function () { share(text, link); };
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  $$(".js-signup").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (form.email.value || "").trim(), starting = form.starting ? form.starting.value.trim() : "";
      if (form._honey && form._honey.value) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say(form, "That email doesn't look right. Mind checking it?", "err"); form.email.focus(); return; }
      var btn = $("button[type=submit]", form); btn.disabled = true; say(form, "Adding you\u2026", "");
      var payload = {
        email: email, starting: starting || "-", ref: sessionStorage.getItem("ref") || "-", my_ref_code: myCode(),
        utm_source: params.get("utm_source") || "-", utm_medium: params.get("utm_medium") || "-", utm_campaign: params.get("utm_campaign") || "-",
        page: location.href, signed_up_at: new Date().toISOString(),
        _subject: "410 Days beta signup: " + email, _template: "table", _captcha: "false"
      };
      var fallback = function () {
        say(form, "Opening your email app with a ready-to-send note. Just hit send and you're on the list.", "ok");
        location.href = mailto(email, starting);
      };
      if (!C.FORM_ENDPOINT) { btn.disabled = false; return fallback(); }
      fetch(C.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          btn.disabled = false;
          var success = res.ok && !(res.j && (res.j.success === "false" || res.j.success === false));
          if (!success) return fallback();
          say(form, "You're on the list.", "ok"); form.reset();
          try { localStorage.setItem("signedUp", "1"); } catch (e) {}
          thanks();
        })
        .catch(function () { btn.disabled = false; fallback(); });
    });
  });
})();

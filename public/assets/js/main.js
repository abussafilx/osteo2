/* Osteopatia Pro | JS mínimo, sem dependências */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menu em ecrã inteiro ---------- */
  var burger = doc.querySelector(".burger");
  var menu = doc.getElementById("menu");
  if (burger && menu) {
    var lastFocus = null;
    var focusables = function () {
      return [burger].concat([].slice.call(menu.querySelectorAll("a[href], button")));
    };
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.classList.toggle("is-open", open);
      doc.body.classList.toggle("menu-open", open);
      if (open) { menu.removeAttribute("inert"); lastFocus = doc.activeElement; var a = menu.querySelector("a"); if (a) a.focus({ preventScroll: true }); }
      else { menu.setAttribute("inert", ""); if (lastFocus) burger.focus({ preventScroll: true }); }
    };
    menu.setAttribute("inert", "");
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") { setMenu(false); return; }
      if (e.key === "Tab") {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- header com sombra ao rolar + barra de marcação no telemóvel ---------- */
  var mbar = doc.querySelector(".mbar");
  var onScroll = function () { root.classList.toggle("is-scrolled", window.scrollY > 24); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  if (mbar) setTimeout(function () { mbar.classList.add("is-visible"); }, reduce ? 0 : 700);

  /* ---------- reveal ao entrar no ecrã ---------- */
  var revealEls = [].slice.call(doc.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- frase de destaque: palavra a palavra ---------- */
  var tag = doc.querySelector(".tagline__text");
  if (tag) {
    if (reduce || !("IntersectionObserver" in window)) { tag.classList.add("static"); }
    else {
      var words = tag.textContent.trim().split(/\s+/);
      tag.setAttribute("aria-label", tag.textContent.trim());
      tag.innerHTML = "";
      words.forEach(function (w, i) {
        var s = doc.createElement("span");
        s.className = "w"; s.setAttribute("aria-hidden", "true"); s.textContent = w;
        tag.appendChild(s);
        if (i < words.length - 1) tag.appendChild(doc.createTextNode(" "));
      });
      var wio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var passed = en.boundingClientRect.top <= (en.rootBounds ? en.rootBounds.bottom : window.innerHeight);
          en.target.classList.toggle("on", passed);
        });
      }, { rootMargin: "0px 0px -40% 0px", threshold: [0, 1] });
      [].forEach.call(tag.querySelectorAll(".w"), function (s) { wio.observe(s); });
    }
  }

  /* ---------- passos: coluna vertebral que se preenche ---------- */
  var steps = [].slice.call(doc.querySelectorAll(".step"));
  if (steps.length) {
    if ("IntersectionObserver" in window && !reduce) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-on"); sio.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -30% 0px", threshold: 0.2 });
      steps.forEach(function (s) { sio.observe(s); });
    } else { steps.forEach(function (s) { s.classList.add("is-on"); }); }
  }

  /* ---------- consentimento (RGPD) para conteúdos de terceiros ---------- */
  var KEY = "op_consent";
  var get = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var set = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
  var banner = doc.getElementById("consent");

  function loadReviews(box) {
    if (!box || box.dataset.loaded) return;
    box.dataset.loaded = "1";
    var gate = box.querySelector(".gate"); if (gate) gate.remove();
    var host = doc.createElement("div");
    host.id = box.dataset.featurable;
    host.setAttribute("data-featurable-async", "");
    host.setAttribute("data-location-code", "pt-BR");
    box.appendChild(host);
    var s = doc.createElement("script");
    s.src = "https://featurable.com/assets/bundle.js"; s.defer = true; s.charset = "UTF-8";
    doc.body.appendChild(s);
  }
  function loadVideo(box) {
    if (!box || box.dataset.loaded) return;
    box.dataset.loaded = "1";
    var gate = box.querySelector(".gate"); if (gate) gate.remove();
    var f = doc.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + box.dataset.video + "?rel=0";
    f.title = box.dataset.title || "Vídeo";
    f.loading = "lazy";
    f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    box.appendChild(f);
  }
  function loadAll() {
    [].forEach.call(doc.querySelectorAll("[data-featurable]"), loadReviews);
    [].forEach.call(doc.querySelectorAll("[data-video]"), loadVideo);
  }

  [].forEach.call(doc.querySelectorAll("[data-load]"), function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest("[data-featurable], [data-video]");
      if (box && box.hasAttribute("data-featurable")) loadReviews(box); else loadVideo(box);
    });
  });

  var choice = get();
  if (choice === "all") loadAll();
  if (banner && !choice) {
    var measure = function () { root.style.setProperty("--consent-h", banner.offsetHeight + "px"); };
    setTimeout(function () { banner.classList.add("is-visible"); root.classList.add("has-consent"); measure(); }, 1200);
    window.addEventListener("resize", measure);
    var close = function (v) {
      set(v); banner.classList.remove("is-visible"); root.classList.remove("has-consent");
      if (v === "all") loadAll();
    };
    var a = banner.querySelector("[data-consent=all]"), e = banner.querySelector("[data-consent=essential]");
    if (a) a.addEventListener("click", function () { close("all"); });
    if (e) e.addEventListener("click", function () { close("essential"); });
  }
  var reopen = doc.querySelector("[data-consent-reopen]");
  if (reopen) reopen.addEventListener("click", function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });

  /* ---------- formulário de contacto: validação ---------- */
  var form = doc.querySelector("form[data-validate]");
  if (form) {
    form.setAttribute("novalidate", "");
    var validators = {
      nome: function (v) { return v.trim().length >= 2 ? "" : "Indique o seu nome."; },
      telefone: function (v) { var d = v.replace(/[^\d]/g, ""); return d.length >= 9 ? "" : "Indique um telefone com pelo menos 9 dígitos."; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Este email não parece válido."; },
      privacidade: function (v, el) { return el.checked ? "" : "Para enviar, aceite a política de privacidade."; }
    };
    var check = function (el) {
      var fn = validators[el.name]; if (!fn) return true;
      var msg = fn(el.value, el), wrap = el.closest(".field");
      var err = wrap.querySelector(".field__error");
      if (msg) { wrap.setAttribute("data-invalid", ""); if (err) err.textContent = msg; el.setAttribute("aria-invalid", "true"); }
      else { wrap.removeAttribute("data-invalid"); el.removeAttribute("aria-invalid"); }
      return !msg;
    };
    [].forEach.call(form.querySelectorAll("input, textarea"), function (el) {
      el.addEventListener("blur", function () { check(el); });
      el.addEventListener("input", function () { if (el.closest("[data-invalid]")) check(el); });
    });
    form.addEventListener("submit", function (ev) {
      var bad = null;
      [].forEach.call(form.querySelectorAll("input, textarea"), function (el) { if (!check(el) && !bad) bad = el; });
      if (bad) { ev.preventDefault(); bad.focus(); }
    });
  }
})();

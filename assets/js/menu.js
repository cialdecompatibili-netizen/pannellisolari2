/* =====================================================================
   MENU DEL SITO (assets/js/menu.js)  -  adattato da nav-toggle.js di al-folio
   Nessuna libreria. Fa tre cose:
     1) il pulsante hamburger [data-nv-toggle="nv-panel"] apre/chiude il pannello #nv-panel
     2) il padre di una tendina [data-nv-dropdown-toggle] apre/chiude la sua tendina
        (una sola tendina aperta per volta)
     3) si chiude tutto cliccando fuori, premendo Esc o toccando un link del menu
   Lo stato "aperto" e' la classe .show (sul pannello e sull'<li> della tendina):
   l'aspetto lo decide menu.css. Gli attributi aria-expanded sono aggiornati per
   chi usa la tastiera o uno screen reader.
   ===================================================================== */
(function () {
  function init() {
    var toggle = document.querySelector('[data-nv-toggle]');
    var panel = toggle ? document.getElementById(toggle.getAttribute('data-nv-toggle')) : null;
    var ddToggles = Array.prototype.slice.call(document.querySelectorAll('[data-nv-dropdown-toggle]'));
    // 4) Carrello (solo con e-commerce acceso): su mobile sta nella barra in alto, a sinistra delle 3 lineette,
    //    invece che nascosto dentro il pannello. E' lo stesso elemento (id e eventi restano): lo si sposta e basta.
    //    Da 768px in su torna nella sua voce di menu.
    var cartw = document.querySelector('.nz-cartw');
    if (cartw && toggle && window.matchMedia) {
      var cartLi = cartw.closest('.nz-li');
      var mq = window.matchMedia('(max-width: 767.98px)');
      var placeCart = function () {
        if (mq.matches) {
          if (cartw.parentNode !== toggle.parentNode) toggle.parentNode.insertBefore(cartw, toggle);
          if (cartLi) cartLi.style.display = 'none';
        } else {
          if (cartLi && cartw.parentNode !== cartLi) cartLi.appendChild(cartw);
          if (cartLi) cartLi.style.display = '';
        }
      };
      placeCart();
      if (mq.addEventListener) mq.addEventListener('change', placeCart); else mq.addListener(placeCart);
    }

    // chiude tutte le tendine (tranne "except", se data)
    function closeDropdowns(except) {
      ddToggles.forEach(function (t) {
        if (t === except) return;
        var li = t.closest('.nv__item');
        if (li) li.classList.remove('show');
        t.setAttribute('aria-expanded', 'false');
      });
    }

    // chiude il pannello hamburger (e le tendine dentro)
    function closePanel() {
      if (!toggle || !panel) return;
      panel.classList.remove('show');
      toggle.classList.add('collapsed');
      toggle.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    }

    if (toggle && panel) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = panel.classList.contains('show');
        if (open) { closePanel(); return; }
        panel.classList.add('show');
        toggle.classList.remove('collapsed');
        toggle.setAttribute('aria-expanded', 'true');
      });
    }

    ddToggles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();           // cosi' il click non arriva al "chiudi tutto" qui sotto
        var li = t.closest('.nv__item');
        var open = li.classList.contains('show');
        closeDropdowns(t);
        li.classList.toggle('show', !open);
        t.setAttribute('aria-expanded', String(!open));
      });
    });

    // ---- VOCE ATTIVA (calcolata qui e non in masthead.html: il tema mette il masthead in cache) ----
    // Regola: una voce e' attiva se l'indirizzo della pagina e' uguale al suo, oppure sta "dentro"
    // (es. voce /blog/ attiva anche su /blog/2026/...). La Home e' attiva solo sulla home.
    // Ignorati: link esterni, "#", ancore tipo /#pricing. Una voce di tendina e' attiva se lo e' un figlio.
    function norm(p) { return p.replace(/index\.html$/, ''); }
    var here = norm(location.pathname);
    var home = norm(document.querySelector('.nv__brand').pathname);
    function setActive(el) { if (el) el.classList.add('active'); }
    Array.prototype.forEach.call(document.querySelectorAll('.nv__dd-item'), function (a) {
      if (norm(a.pathname) === here) { setActive(a); setActive(a.closest('.nv__item')); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nv__item > a.nv__link'), function (a) {
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || a.hash || a.host !== location.host) return;
      var p = norm(a.pathname);
      if (p === home ? here === home : here.indexOf(p) === 0) setActive(a.parentNode);
    });

    // click fuori dal menu = chiudi tutto; click su un link = chiudi l'hamburger
    document.addEventListener('click', function (e) {
      var inside = e.target.closest && e.target.closest('#site-nav');
      if (!inside) { closePanel(); closeDropdowns(); return; }
      if (e.target.closest('a')) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePanel(); closeDropdowns(); }
    });

    // ---- ADATTAMENTO AUTOMATICO (desktop, da 768px) ----
    // Se le voci non ci stanno accanto al marchio, invece di sovrapporsi tutto si rimpicciolisce:
    // si prova con fattori 1, 0.97, 0.94 ... fino a 0.55 e si tiene il primo che non si sovrappone.
    // Il fattore e' la variabile CSS --nv-s sull'header (la usa menu.css).
    function fitMenu() {
      var header = document.querySelector('.nv-header');
      var brand = header && header.querySelector('.nv__brand');
      var list = header && header.querySelector('.nv__list');
      if (!header || !brand || !list) return;
      if (window.innerWidth < 768) { header.style.removeProperty('--nv-s'); return; }   // 768 = stesso valore di menu.css
      var s = 1;
      header.style.setProperty('--nv-s', s);
      function sovrapposto() {
        return list.getBoundingClientRect().left < brand.getBoundingClientRect().right + 8 ||
               list.scrollWidth > list.parentNode.clientWidth + 1;
      }
      while (sovrapposto() && s > 0.55) {
        s = Math.round((s - 0.03) * 100) / 100;
        header.style.setProperty('--nv-s', s);
      }
    }
    var fitTimer = null;
    function fitSoon() { if (fitTimer) cancelAnimationFrame(fitTimer); fitTimer = requestAnimationFrame(fitMenu); }
    fitMenu();
    window.addEventListener('resize', fitSoon);
    window.addEventListener('load', fitMenu);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMenu);   // i font web cambiano le larghezze

    // se si allarga la finestra con il pannello aperto, torna tutto pulito
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closePanel();   // 768 = stesso valore di menu.css
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

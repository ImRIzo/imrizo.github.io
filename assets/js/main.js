/* ============================================================
   Rezowan Sarkar - Portfolio
   Vanilla JS. Replaces: bootstrap, aos, isotope, glightbox,
   swiper, typed.js, waypoints, purecounter, php-email-form.
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var html = doc.documentElement;
  html.classList.add("js");

  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  var navToggle = $(".mobile-nav-toggle");
  var backdrop = $(".nav-backdrop");
  var body = doc.body;

  function closeNav() {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<i class="bx bx-menu"></i>';
    }
  }
  function toggleNav() {
    var open = body.classList.toggle("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.innerHTML = '<i class="bx ' + (open ? "bx-x" : "bx-menu") + '"></i>';
    }
  }
  if (navToggle) navToggle.addEventListener("click", toggleNav);
  if (backdrop) backdrop.addEventListener("click", closeNav);
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Close the drawer when a nav link is clicked */
  $$("#navbar a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = $$("#navbar a[href^='#']");
  var sections = navLinks
    .map(function (link) { return $(link.getAttribute("href")); })
    .filter(Boolean);

  function updateActiveLink() {
    if (!sections.length) return;
    var pos = window.scrollY + 160;
    var currentId = sections[0].id;
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop && pos <= sec.offsetTop + sec.offsetHeight) currentId = sec.id;
    });
    /* Bottom of page → last section */
    if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Back to top ---------- */
  var backToTop = $(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });
  }

  /* ---------- Hero typewriter ---------- */
  var typedEl = $(".typed");
  if (typedEl) {
    var phrases = typedEl.getAttribute("data-typed").split(",");
    var pi = 0, ci = 0, deleting = false;
    (function type() {
      var word = phrases[pi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);
      var delay = deleting ? 45 : 95;
      if (!deleting && ci === word.length) { delay = 2100; deleting = true; }
      else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 450;
      }
      setTimeout(type, delay);
    })();
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$("[data-reveal]");
  function revealIn(el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.transitionDelay = delay + "ms";
    el.classList.add("in");
  }
  if (revealEls.length) {
    var revealIO = null;
    var ioFired = false;
    if ("IntersectionObserver" in window) {
      /* threshold 0 so tall elements (e.g. the portfolio grid on mobile)
         also reveal as soon as their top edge enters the viewport */
      revealIO = new IntersectionObserver(function (entries) {
        ioFired = true;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealIn(entry.target);
            revealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function (el) { revealIO.observe(el); });
    } else {
      revealEls.forEach(revealIn);
    }
    /* Safety nets: reveal what's already on screen, and if IO never fires
       (very old browsers / odd embeds), fall back to a scroll check. */
    function revealVisible() {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 30 && r.bottom > 0) revealIn(el);
      });
    }
    function fallbackScroll() {
      if (!ioFired) revealVisible();
      else window.removeEventListener("scroll", fallbackScroll);
    }
    window.addEventListener("scroll", fallbackScroll, { passive: true });
    revealVisible();
  }

  /* ---------- Skill bars ---------- */
  var skillsWrap = $(".skills-grid");
  if (skillsWrap && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $$(".skill .fill", skillsWrap).forEach(function (fill) {
          fill.style.width = fill.getAttribute("data-value") + "%";
        });
      });
    }, { threshold: 0.25 }).observe(skillsWrap);
  }

  /* ---------- Portfolio filter ---------- */
  var filterButtons = $$(".filters button");
  var pItems = $$(".p-item");
  if (filterButtons.length && pItems.length) {
    var PHOTO_CAT = "photography";
    function applyFilter(cat) {
      pItems.forEach(function (item) {
        var show;
        if (cat === "all") show = item.getAttribute("data-category") !== PHOTO_CAT;
        else show = item.getAttribute("data-category") === cat;
        item.classList.toggle("hide", !show);
      });
    }
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
    applyFilter("all");
  }

  /* ---------- Lightbox (video / image / youtube) ---------- */
  var lbItems = $$("[data-lightbox]");
  var lightbox = $("#lightbox");
  if (lightbox && lbItems.length) {
    var lbStage = $(".lb-stage", lightbox);
    var lbClose = $(".lb-close", lightbox);
    var lbPrev = $(".lb-prev", lightbox);
    var lbNext = $(".lb-next", lightbox);
    var lbIndex = 0;
    var lastFocus = null;

    function youtubeId(url) {
      var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
      return m ? m[1] : null;
    }

    function render() {
      var el = lbItems[lbIndex];
      var type = el.getAttribute("data-lightbox");
      var href = el.getAttribute("href");
      lbStage.innerHTML = "";

      if (type === "video") {
        var v = doc.createElement("video");
        v.src = href;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        lbStage.appendChild(v);
      } else if (type === "youtube") {
        var id = youtubeId(href);
        if (id) {
          var frame = doc.createElement("iframe");
          frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
          frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          frame.allowFullscreen = true;
          frame.title = "YouTube video";
          lbStage.appendChild(frame);
        }
      } else {
        var img = doc.createElement("img");
        img.src = href;
        img.alt = "";
        lbStage.appendChild(img);
      }
    }

    function open(index) {
      lbIndex = (index + lbItems.length) % lbItems.length;
      lastFocus = doc.activeElement;
      render();
      lightbox.hidden = false;
      body.style.overflow = "hidden";
      lbClose.focus();
    }
    function close() {
      lightbox.hidden = true;
      body.style.overflow = "";
      lbStage.innerHTML = "";
      if (lastFocus) lastFocus.focus();
    }
    function step(dir) { open(lbIndex + dir); }

    lbItems.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        open(lbItems.indexOf(el));
      });
    });
    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    doc.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Testimonials slider ---------- */
  var track = $(".t-track");
  var dotsWrap = $(".t-dots");
  if (track && dotsWrap) {
    var slides = $$(".t-slide", track);
    var n = slides.length;
    var page = 0;
    var autoplayTimer = null;

    function perView() {
      if (window.innerWidth >= 1200) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    function maxPage() { return Math.max(0, n - perView()); }

    function go(p) {
      page = Math.min(Math.max(p, 0), maxPage());
      track.style.transform = "translateX(-" + page * (100 / perView()) + "%)";
      $$("button", dotsWrap).forEach(function (dot, i) {
        dot.classList.toggle("active", i === page);
      });
    }
    function next() {
      go(page >= maxPage() ? 0 : page + 1);
    }
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, 5000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    /* Build dots (rebuilt on breakpoint change) */
    function buildDots() {
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxPage(); i++) {
        (function (idx) {
          var dot = doc.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
          dot.addEventListener("click", function () { go(idx); startAutoplay(); });
          dotsWrap.appendChild(dot);
        })(i);
      }
      /* Sync active dot */
      $$("button", dotsWrap).forEach(function (dot, i) {
        dot.classList.toggle("active", i === page);
      });
    }

    /* Touch swipe */
    var startX = null;
    track.addEventListener("pointerdown", function (e) { startX = e.clientX; stopAutoplay(); });
    track.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var delta = e.clientX - startX;
      if (Math.abs(delta) > 40) go(page + (delta < 0 ? 1 : -1));
      startX = null;
      startAutoplay();
    });
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    var lastPerView = perView();
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (perView() !== lastPerView) {
          lastPerView = perView();
          buildDots();
        }
        go(page);
      }, 150);
    });

    buildDots();
    go(0);
    startAutoplay();
  }

  /* ---------- Contact form → mailto (no server needed on GH Pages) ---------- */
  var contactForm = $("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var subject = contactForm.subject.value.trim();
      var message = contactForm.message.value.trim();
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      window.location.href =
        "mailto:rsarkar.pro@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();

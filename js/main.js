document.addEventListener("DOMContentLoaded", () => {
  initNavLoader();
  initSmoothScrollNav();
  initMobileMenu();
  initScrollReveal();
  initTypewriter();
  initScrollProgress();
  initNavbarShadow();
  initLazyLoading();
  initBackToTop();
});
/* ---------- Navbar loading animation ----------
   Shows a ChatGPT-style "thinking" dot loader in place of the name
   for a beat, then the dots resolve into the name typed out
   letter by letter — a small nod to the page's loading theme. */
function initNavLoader() {
  const loader = document.getElementById("navLoader");
  const nameEl = document.getElementById("navName");
  if (!loader || !nameEl) return;

  const name = "Bishal Shrestha";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    loader.classList.add("done");
    nameEl.textContent = name;
    return;
  }

  const dotDuration = 900; // ms the dots bounce before resolving

  setTimeout(() => {
    loader.classList.add("done");
    let i = 0;
    const speed = 90;

    function type() {
      if (i <= name.length) {
        nameEl.textContent = name.slice(0, i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }, dotDuration);
}

/* ---------- Smooth scroll + active nav link ---------- */
function initSmoothScrollNav() {
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link");
  const sections = document.querySelectorAll("main section[id]");
  const navbar = document.getElementById("navbar");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const offset = (navbar ? navbar.offsetHeight : 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });

      closeMobileMenu();
    });
  });

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const linkFor = (id) => document.querySelector(`.nav-link[href="#${id}"]`);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          document
            .querySelectorAll(".nav-link.active")
            .forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
}

function openMobileMenu() {
  document.getElementById("mobileMenu")?.classList.remove("hidden");
  document.getElementById("menuBtn")?.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  document.getElementById("mobileMenu")?.classList.add("hidden");
  document.getElementById("menuBtn")?.setAttribute("aria-expanded", "false");
}

/* ---------- Scroll reveal ----------
   Fades + rises .reveal elements into place as they enter view.
   Also triggers the skill-bar fill animation once visible. */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          // If this reveal block contains skill bars, animate them now
          entry.target.querySelectorAll(".skill-bar").forEach((bar) => {
            const width = bar.getAttribute("data-width") || "0";
            requestAnimationFrame(() => {
              bar.style.width = width + "%";
            });
          });

          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- Hero typewriter ----------
   Mimics a ChatGPT-style streaming response in the hero bubble. */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const text =
    "I don't just write code. I build software people wants to keep using.";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }

  let i = 0;
  const speed = 37; // ms per character

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ---------- Scroll progress bar ----------
   Fills the thin bar under the navbar from 0% to 100% as the
   user scrolls from the top of the page to the bottom. */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );

  update();
}

/* ---------- Navbar shadow on scroll ---------- */

function initNavbarShadow() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const toggleShadow = () => {
    if (window.scrollY > 8) {
      navbar.classList.add("shadow-sm");
    } else {
      navbar.classList.remove("shadow-sm");
    }
  };
  toggleShadow();
  window.addEventListener("scroll", toggleShadow, { passive: true });
}

/* ---------- Lazy loading images ----------
   Images use data-src instead of src. Once an image scrolls
   near the viewport, we swap it in and fade it in via CSS. */
function initLazyLoading() {
  const images = document.querySelectorAll("img.lazy-img[data-src]");

  if (!("IntersectionObserver" in window)) {
    // Fallback: just load everything immediately
    images.forEach(loadImage);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "150px 0px", threshold: 0.01 },
  );

  images.forEach((img) => observer.observe(img));
}

function loadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) return;
  img.src = src;
  img.addEventListener("load", () => img.classList.add("loaded"), {
    once: true,
  });
  img.removeAttribute("data-src");
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("opacity-0", !show);
    btn.classList.toggle("pointer-events-none", !show);
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

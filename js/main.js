document.addEventListener('DOMContentLoaded', () => {
  initNavLoader();
  initSmoothScrollNav();
  initMobileMenu();

});
/* ---------- Navbar loading animation ----------
   Shows a ChatGPT-style "thinking" dot loader in place of the name
   for a beat, then the dots resolve into the name typed out
   letter by letter — a small nod to the page's loading theme. */
function initNavLoader() {
  const loader = document.getElementById('navLoader');
  const nameEl = document.getElementById('navName');
  if (!loader || !nameEl) return;

  const name = 'Bishal Shrestha';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    loader.classList.add('done');
    nameEl.textContent = name;
    return;
  }

  const dotDuration = 900; // ms the dots bounce before resolving

  setTimeout(() => {
    loader.classList.add('done');
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
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('main section[id]');
  const navbar = document.getElementById('navbar');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const offset = (navbar ? navbar.offsetHeight : 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      closeMobileMenu();
    });
  });

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const linkFor = (id) => document.querySelector(`.nav-link[href="#${id}"]`);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link.active').forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
}

function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('hidden');
  document.getElementById('menuBtn')?.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('hidden');
  document.getElementById('menuBtn')?.setAttribute('aria-expanded', 'false');
}

//  Silvalum  Main 

// Navbar toggle
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  const openMenu = () => {
    navMenu.classList.add('nav-menu--open');
    hamburger.classList.add('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    navMenu.classList.remove('nav-menu--open');
    hamburger.classList.remove('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('nav-menu--open');
    isOpen ? closeMenu() : openMenu();
  });

  navMenu.querySelectorAll('.nav-link, .nav-menu-cta .btn').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// Header background on scroll
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Hero cinematic entrance sequence
const heroAnims = document.querySelectorAll('.hero-anim');
if (heroAnims.length) {
  requestAnimationFrame(() => {
    heroAnims.forEach((el) => el.classList.add('is-visible'));
  });
}

// Scroll reveal (IntersectionObserver)
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => observer.observe(el));
}
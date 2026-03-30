const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const header = document.getElementById("site-header");
const heroVideo = document.querySelector(".hero-bg-video");
const heroAnims = document.querySelectorAll(".hero-anim");
const reveals = document.querySelectorAll(".reveal");
const whatsappBtn = document.getElementById("whatsapp-btn");

if (hamburger && navMenu) {
  const openMenu = () => {
    navMenu.classList.add("nav-menu--open");
    hamburger.classList.add("hamburger--open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Cerrar menú");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    navMenu.classList.remove("nav-menu--open");
    hamburger.classList.remove("hamburger--open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("nav-menu--open");
    isOpen ? closeMenu() : openMenu();
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target === navMenu) {
      closeMenu();
    }
  });

  navMenu.querySelectorAll(".nav-link, .nav-menu-cta .btn").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

const showImmediately = () => {
  heroAnims.forEach((element) => element.classList.add("is-visible"));
  reveals.forEach((element) => element.classList.add("is-visible"));
};

if (prefersReducedMotion.matches) {
  showImmediately();

  if (heroVideo) {
    heroVideo.pause();
  }
} else {
  if (heroAnims.length) {
    requestAnimationFrame(() => {
      heroAnims.forEach((element) => element.classList.add("is-visible"));
    });
  }

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach((element) => revealObserver.observe(element));
  }
}

const trackedSections = navLinks
  .map((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const section = id ? document.getElementById(id) : null;
    return section ? { id, link, section } : null;
  })
  .filter(Boolean);

if (trackedSections.length) {
  const setActiveLink = (activeId) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  const getActivationLine = () => {
    const headerOffset = header?.offsetHeight ?? 0;
    const viewportOffset = Math.max(96, (window.innerHeight - headerOffset) * 0.3);
    return window.scrollY + headerOffset + viewportOffset;
  };

  const updateActiveSection = () => {
    const lastSection = trackedSections[trackedSections.length - 1];
    const isNearPageBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12;

    if (lastSection && isNearPageBottom) {
      setActiveLink(lastSection.id);
      return;
    }

    const activationLine = getActivationLine();
    let activeId = trackedSections[0].id;

    trackedSections.forEach(({ id, section }) => {
      if (activationLine >= section.offsetTop) {
        activeId = id;
      }
    });

    setActiveLink(activeId);
  };

  let ticking = false;

  const requestActiveSectionUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    requestAnimationFrame(() => {
      updateActiveSection();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", requestActiveSectionUpdate);
  window.addEventListener("load", updateActiveSection);
  updateActiveSection();
}

if ("ontouchstart" in window || window.matchMedia("(hover: none)").matches) {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const wasActive = card.classList.contains("is-active");
      projectCards.forEach((item) => item.classList.remove("is-active"));

      if (!wasActive) {
        card.classList.add("is-active");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".project-card")) {
      projectCards.forEach((item) => item.classList.remove("is-active"));
    }
  });
}

if (whatsappBtn) {
  const phoneNumber = "573015788474";
  const message =
    "Hola Silvalum, quiero cotizar un proyecto de vidrio y aluminio. Les comparto el tipo de espacio, unas medidas aproximadas y fotos de referencia.";

  whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

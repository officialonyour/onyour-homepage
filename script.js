const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const revealElements = document.querySelectorAll(".reveal");

function closeMobileMenu() {
  menuButton?.classList.remove("active");
  mobileMenu?.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");

  menuButton.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
  revealObserver.observe(element);
});

window.addEventListener("load", () => {
  document
    .querySelectorAll(".hero .reveal")
    .forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("visible");
      }, 180 + index * 160);
    });
});
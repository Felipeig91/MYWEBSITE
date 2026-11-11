const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".desktop-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("nav-open", !isOpen);
});

document.querySelectorAll(".desktop-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  status.textContent = "Thanks — I’ll be in touch shortly.";
  event.currentTarget.reset();
});

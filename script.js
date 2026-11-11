const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".desktop-nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const revealWithObserver = () => {
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
};

const initMotion = () => {
  const revealElements = document.querySelectorAll(".reveal");
  const heroCopy = document.querySelector(".hero-copy");
  const heroArt = document.querySelector(".hero-art");
  const heroMeta = document.querySelector(".hero-meta");

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    if (reduceMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      revealWithObserver();
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(heroCopy?.querySelector(".eyebrow"), { y: 22, autoAlpha: 0, duration: 0.7 })
    .from(heroCopy?.querySelector("h1"), { y: 35, autoAlpha: 0, scale: 0.98, duration: 0.9 }, "-=0.4")
    .from(heroCopy?.querySelector(".hero-lede"), { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.55")
    .from(heroCopy?.querySelectorAll(".hero-actions > *"), { y: 18, autoAlpha: 0, duration: 0.65, stagger: 0.1 }, "-=0.4")
    .from(heroArt, { y: 28, autoAlpha: 0, scale: 0.97, duration: 0.9 }, "-=0.55")
    .from(heroMeta, { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.45");

  document.querySelectorAll(".reveal:not(.hero-copy):not(.hero-art):not(.hero-meta)").forEach((element) => {
    gsap.fromTo(
      element,
      { y: 42, autoAlpha: 0, scale: 0.985 },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true
        }
      }
    );
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion, { once: true });
} else {
  initMotion();
}

document.querySelector(".contact-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');

  status.textContent = "Sending...";
  submitButton.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send the message.");
    }

    status.textContent = "Thanks — I’ll be in touch shortly.";
    form.reset();
  } catch (error) {
    status.textContent = "Could not send your message. Please try again.";
    console.error("Contact form submission failed:", error);
  } finally {
    submitButton.disabled = false;
  }
});

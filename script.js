// script.js
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile Menu Toggle
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Robust Smooth Scrolling for all hash links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") return;
    
    e.preventDefault();
    
    if (href === "#top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // Adjust based on header height
        const top = target.offsetTop - offset;
        window.scrollTo({
          top: top,
          behavior: "smooth"
        });
      }
    }
  });
});

// Scroll Reveal Observer
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
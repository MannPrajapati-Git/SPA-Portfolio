// ========================
// SHOWCASE PAGE JAVASCRIPT
// ========================

// Year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

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

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


// ========================
// SLIDER LOGIC
// ========================

document.querySelectorAll(".sc-card-slider").forEach(card => {
  const track = card.querySelector(".sc-slider-track");
  const slides = card.querySelectorAll(".sc-slide");
  const dotsContainer = card.querySelector(".sc-slider-dots");
  const leftArrow = card.querySelector(".sc-arrow-left");
  const rightArrow = card.querySelector(".sc-arrow-right");
  let currentIndex = 0;
  const total = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("sc-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(i);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".sc-dot");

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(currentIndex - 1);
  });

  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(currentIndex + 1);
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
  }, { passive: true });

  // Auto-play (optional — pauses on hover)
  let autoPlay = setInterval(() => goTo(currentIndex + 1), 4000);

  card.addEventListener("mouseenter", () => clearInterval(autoPlay));
  card.addEventListener("mouseleave", () => {
    autoPlay = setInterval(() => goTo(currentIndex + 1), 4000);
  });
});


// ========================
// FILTER LOGIC
// ========================

const filterBtns = document.querySelectorAll(".sc-filter-btn");
const allCards = document.querySelectorAll(".sc-card");
const emptyState = document.getElementById("scEmpty");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    // Update active button
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    let visibleCount = 0;

    allCards.forEach(card => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("sc-hidden");
        card.style.animation = "scFadeIn .4s ease forwards";
        visibleCount++;
      } else {
        card.classList.add("sc-hidden");
        card.style.animation = "";
      }
    });

    // Show/hide empty state
    if (emptyState) {
      emptyState.classList.toggle("visible", visibleCount === 0);
    }
  });
});


// ========================
// LIGHTBOX LOGIC
// ========================

const lightbox = document.getElementById("scLightbox");
const lightboxBackdrop = document.getElementById("scLightboxBackdrop");
const lightboxClose = document.getElementById("scLightboxClose");
const lightboxImg = document.getElementById("scLightboxImg");
const lightboxCounter = document.getElementById("scLightboxCounter");
const lbPrev = document.getElementById("scLbPrev");
const lbNext = document.getElementById("scLbNext");

let lightboxImages = [];
let lightboxIndex = 0;

function collectVisibleImages() {
  lightboxImages = [];
  document.querySelectorAll(".sc-card:not(.sc-hidden)").forEach(card => {
    card.querySelectorAll("img").forEach(img => {
      lightboxImages.push(img.src);
    });
  });
}

function openLightbox(src) {
  collectVisibleImages();
  lightboxIndex = lightboxImages.indexOf(src);
  if (lightboxIndex === -1) lightboxIndex = 0;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { lightboxImg.src = ""; }, 400);
}

function updateLightbox() {
  lightboxImg.src = lightboxImages[lightboxIndex];
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function lbGo(dir) {
  lightboxIndex += dir;
  if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
  if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
  updateLightbox();
}

// Click on slider images to open lightbox (only img, to avoid conflicts with arrows/dots)
document.querySelectorAll(".sc-slide img").forEach(img => {
  img.addEventListener("click", () => openLightbox(img.src));
});

// Click anywhere on single-image cards (certificates, webinars, community) to open lightbox
document.querySelectorAll(".sc-card-single").forEach(card => {
  card.addEventListener("click", () => {
    const img = card.querySelector(".sc-single-img img");
    if (img) openLightbox(img.src);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
if (lbPrev) lbPrev.addEventListener("click", () => lbGo(-1));
if (lbNext) lbNext.addEventListener("click", () => lbGo(1));

// Keyboard
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbGo(-1);
  if (e.key === "ArrowRight") lbGo(1);
});

// Lightbox touch swipe
let lbStartX = 0;
const lbBody = document.querySelector(".sc-lightbox-body");

if (lbBody) {
  lbBody.addEventListener("touchstart", (e) => {
    lbStartX = e.touches[0].clientX;
  }, { passive: true });

  lbBody.addEventListener("touchend", (e) => {
    const diff = lbStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? lbGo(1) : lbGo(-1);
    }
  }, { passive: true });
}
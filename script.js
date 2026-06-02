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

// Certificate & Drawer Modal Logic
const certModal = document.getElementById('certModal');
const certModalBackdrop = document.getElementById('certModalBackdrop');
const certModalClose = document.getElementById('certModalClose');
const certModalImg = document.getElementById('certModalImg');

const openCertModal = (imgSrc) => {
  if (!certModal) return;
  certModalImg.src = imgSrc;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeCertModal = () => {
  if (!certModal) return;
  certModal.classList.remove('open');
  setTimeout(() => {
    certModalImg.src = '';
  }, 400); 
  
  const resultsDrawer = document.getElementById('resultsDrawer');
  if (!resultsDrawer || !resultsDrawer.classList.contains('open')) {
    document.body.style.overflow = '';
  }
};

if (certModal) {
  document.querySelectorAll('.cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openCertModal(btn.getAttribute('data-img'));
    });
  });

  certModalClose.addEventListener('click', closeCertModal);
  certModalBackdrop.addEventListener('click', closeCertModal);
}

// Results Drawer Logic
const resultsDrawerBtn = document.getElementById('resultsDrawerBtn');
const resultsDrawer = document.getElementById('resultsDrawer');
const resultsDrawerBackdrop = document.getElementById('resultsDrawerBackdrop');
const resultsDrawerClose = document.getElementById('resultsDrawerClose');

const openDrawer = () => {
  if (!resultsDrawer) return;
  resultsDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeDrawer = () => {
  if (!resultsDrawer) return;
  resultsDrawer.classList.remove('open');
  if (!certModal || !certModal.classList.contains('open')) {
    document.body.style.overflow = '';
  }
};

if (resultsDrawer) {
  if(resultsDrawerBtn) resultsDrawerBtn.addEventListener('click', openDrawer);
  if(resultsDrawerClose) resultsDrawerClose.addEventListener('click', closeDrawer);
  if(resultsDrawerBackdrop) resultsDrawerBackdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-item').forEach(item => {
    item.addEventListener('click', () => {
      openCertModal(item.getAttribute('data-img'));
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (certModal && certModal.classList.contains('open')) {
      closeCertModal();
    } else if (resultsDrawer && resultsDrawer.classList.contains('open')) {
      closeDrawer();
    }
  }
});
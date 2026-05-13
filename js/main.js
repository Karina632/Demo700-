/* ===== COMPONENT LOADER ===== */
async function loadComponent(selector, filePath) {
  const target = document.querySelector(selector);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(`Eroare componentă ${filePath}:`, error);
  }
}

/* ===== LOADING SCREEN ===== */
function initLoader() {
  const loader = document.createElement("div");
  loader.id = "siteLoader";

  loader.innerHTML = `
    <div class="loader-content">
      <h1>LUXE BEAUTY</h1>
    </div>
  `;

  document.body.appendChild(loader);

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), 700);
    }, 1200);
  });
}

/* ===== ACTIVE LINK ===== */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");

    if (href && href.endsWith(currentPage)) {
      link.classList.add("active");
    }
  });
}

/* ===== HAMBURGER ===== */
function initHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ===== BOOKING MODAL ===== */
function initBookingModal() {
  const modal = document.getElementById("bookingModal");
  const openBtns = document.querySelectorAll(".open-booking");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelModal");

  if (!modal) return;

  function openModal() {
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ===== BOOKING FORM ===== */
function initBookingForm() {
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value;

    const whatsappMessage = encodeURIComponent(
`Bună! Vreau o programare:
Nume: ${fullName}
Serviciu: ${service}
Data: ${date}
Interval: ${time}
Mesaj: ${message}`
    );

    window.open(`https://wa.me/40735078813?text=${whatsappMessage}`, "_blank");
  });
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ===== INIT WEBSITE ===== */
document.addEventListener("DOMContentLoaded", async () => {

  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
    initLoader();
  }

  /* ===== VERCEL FIX ===== */
  const basePath = "/components/";

  await loadComponent("#header-component", `${basePath}header.html`);
  await loadComponent("#footer-component", `${basePath}footer.html`);
  await loadComponent("#booking-component", `${basePath}booking-modal.html`);
  await loadComponent("#icons-component", `${basePath}icons.html`);
  await loadComponent("#cookie-banner-component", `${basePath}cookie-banner.html`);
  await loadComponent("#chatbot-component", `${basePath}ai-chatbot.html`);

  if (typeof initCookieSystem === "function") {
    initCookieSystem();
  }

  if (typeof initChatbot === "function") {
    initChatbot();
  }

  setActiveNavLink();
  initHamburger();
  initBookingModal();
  initBookingForm();
  initBackToTop();

});
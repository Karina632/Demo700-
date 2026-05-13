/* ===== TRUE INFINITE PREMIUM SLIDER ===== */

const container = document.querySelector('.popular-container');
const leftBtn = document.querySelector('.arrow.left');
const rightBtn = document.querySelector('.arrow.right');
const dotsContainer = document.querySelector('.dots');

if (container) {

  const originalCards = Array.from(container.children);
  const gap = 20;
  const realCount = originalCards.length;

  /* clone first + last set */
  originalCards.forEach(card => {
    container.appendChild(card.cloneNode(true));
  });

  originalCards.slice().reverse().forEach(card => {
    container.insertBefore(card.cloneNode(true), container.firstChild);
  });

  let cards = document.querySelectorAll('.service-card');

  let cardWidth = originalCards[0].offsetWidth + gap;

  /* start pe setul real */
  container.scrollLeft = cardWidth * realCount;

  /* DOTS */
  dotsContainer.innerHTML = "";

  for (let i = 0; i < realCount; i++) {
    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      container.scrollTo({
        left: (i + realCount) * cardWidth,
        behavior: "smooth"
      });
    });

    dotsContainer.appendChild(dot);
  }

  function updateDots() {
    let index = Math.round(container.scrollLeft / cardWidth) - realCount;

    if (index < 0) index = realCount - 1;
    if (index >= realCount) index = 0;

    document.querySelectorAll(".dots span").forEach(dot => {
      dot.classList.remove("active");
    });

    if (document.querySelectorAll(".dots span")[index]) {
      document.querySelectorAll(".dots span")[index].classList.add("active");
    }
  }

  /* BUTTONS */
  rightBtn?.addEventListener("click", () => {
    container.scrollBy({
      left: cardWidth,
      behavior: "smooth"
    });
  });

  leftBtn?.addEventListener("click", () => {
    container.scrollBy({
      left: -cardWidth,
      behavior: "smooth"
    });
  });

  /* LOOP INVIZIBIL */
  container.addEventListener("scroll", () => {

    if (container.scrollLeft >= cardWidth * (realCount * 2)) {
      container.classList.add("no-scroll");
      container.scrollLeft = cardWidth * realCount;
      container.classList.remove("no-scroll");
    }

    if (container.scrollLeft <= 0) {
      container.classList.add("no-scroll");
      container.scrollLeft = cardWidth * realCount;
      container.classList.remove("no-scroll");
    }

    updateDots();
  });

  /* AUTOPLAY */
  let autoScroll = setInterval(() => {
    container.scrollBy({
      left: cardWidth,
      behavior: "smooth"
    });
  }, 3000);

  function restartAuto() {
    clearInterval(autoScroll);

    autoScroll = setInterval(() => {
      container.scrollBy({
        left: cardWidth,
        behavior: "smooth"
      });
    }, 3000);
  }

  container.addEventListener("mouseenter", () => clearInterval(autoScroll));
  container.addEventListener("mouseleave", restartAuto);

  container.addEventListener("touchstart", () => clearInterval(autoScroll));
  container.addEventListener("touchend", restartAuto);

  window.addEventListener("resize", () => {
    cardWidth = originalCards[0].offsetWidth + gap;
  });

  updateDots();
}
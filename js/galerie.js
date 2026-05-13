

/* ==========================GALERIE=========================== */

const buttons = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".card");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    // active button
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    cards.forEach(card => {
      card.classList.remove("show");
      card.classList.add("hide");

      setTimeout(() => {
        if (filter === "all" || card.classList.contains(filter)) {
          card.style.display = "block";
          card.classList.remove("hide");
          card.classList.add("show");
        } else {
          card.style.display = "none";
        }
      }, 200);
    });

  });
});
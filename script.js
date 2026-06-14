const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const caseModal = document.querySelector(".case-modal");
const modalTitle = caseModal.querySelector("#case-modal-title");
const modalNumber = caseModal.querySelector(".case-modal-number");
const modalContent = caseModal.querySelector(".case-modal-content");
const modalCloseButton = caseModal.querySelector(".case-modal-close");

function closeCaseModal() {
  caseModal.classList.remove("open");
  caseModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".case-button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".case-card");
    modalTitle.textContent = card.dataset.caseTitle;
    modalNumber.textContent = card.dataset.caseNumber;
    modalContent.innerHTML = [...card.querySelectorAll(":scope > p")]
      .map((paragraph) => paragraph.outerHTML)
      .join("");

    caseModal.classList.add("open");
    caseModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalCloseButton.focus();
  });
});

caseModal.querySelectorAll("[data-modal-close]").forEach((element) => {
  element.addEventListener("click", closeCaseModal);
});

caseModal.querySelector(".case-modal-contact").addEventListener("click", closeCaseModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && caseModal.classList.contains("open")) {
    closeCaseModal();
  }
});

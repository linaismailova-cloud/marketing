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
const imageLightbox = document.querySelector(".image-lightbox");
const lightboxImage = imageLightbox.querySelector("img");

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
    const visualSources = card.querySelectorAll(
      ".case-gallery-source .case-gallery, .case-details-source .case-gallery, .case-details-source .prototype-preview"
    );
    modalContent.innerHTML = visualSources.length
      ? [...visualSources].map((source) => source.outerHTML).join("")
      : '<p class="case-gallery-empty">Галерея скоро будет добавлена.</p>';

    modalContent.querySelectorAll("[data-gallery-image]").forEach((item) => {
      item.addEventListener("click", () => {
        lightboxImage.src = item.dataset.galleryImage;
        lightboxImage.alt = item.querySelector("img").alt;
        imageLightbox.classList.add("open");
        imageLightbox.setAttribute("aria-hidden", "false");
      });
    });

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
  if (event.key === "Escape" && imageLightbox.classList.contains("open")) {
    imageLightbox.classList.remove("open");
    imageLightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    return;
  }
  if (event.key === "Escape" && caseModal.classList.contains("open")) {
    closeCaseModal();
  }
});

imageLightbox.addEventListener("click", () => {
  imageLightbox.classList.remove("open");
  imageLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
});

import "./index.css";
import { resetValidation } from "../scripts/validate.js";
import { enableValidation, settings } from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText, setButtonTextDelete } from "../utils/Helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "db10c0e2-8361-46ea-9828-124b832f271b",
    "Content-Type": "application/json",
  },
});

// Global delete modal variables
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn-delete");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

let selectedCard;
let selectedCardId;

// Close and cancel handlers for delete modal
deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Global delete form submit handler
function handleDeletesubmit(evt) {
  evt.preventDefault();
  const submitBtn = deleteForm.querySelector('button[type="submit"]');
  
  if (!selectedCardId) {
    console.error("No card ID selected for deletion!");
    return;
  }
  
  setButtonTextDelete(submitBtn, true, "Delete", "Deleting...");
  
  api.deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard && selectedCard.remove) {
        selectedCard.remove();
      }
      closeModal(deleteModal);
      // Reset selection
      selectedCard = null;
      selectedCardId = null;
    })
    .catch((error) => {
      console.error("Error deleting card:", error);
    })
    .finally(() => {
      setButtonTextDelete(submitBtn, false, "Delete", "Deleting...");
    });
}

// Add event listener once
deleteForm.addEventListener("submit", handleDeletesubmit);

// DOM Elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form-new-post");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const imageInput = document.querySelector("#post-image-input");
const captionInput = document.querySelector("#post-caption-input");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// Load initial data
api
  .getAppInfo()
  .then(([userInfo, initialCards]) => {
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    document.querySelector(".profile__avatar").src = userInfo.avatar;
    initialCards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

// Preview modal close button (moved outside getCardElement)
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  
  // Set initial like count if available
  if (cardLikeCount && data.likes) {
    cardLikeCount.textContent = data.likes.length;
  }
  
  // Set initial like state
  if (data.likes && data.likes.some(like => like._id === "db10c0e2-8361-46ea-9828-124b832f271b")) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  // Like button functionality
  function handleLike(evt, cardId) {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_active");
    
    const likePromise = isLiked 
      ? api.unlikeCard(cardId)
      : api.likeCard(cardId);
    
    likePromise
      .then((updatedCard) => {
        cardLikeBtn.classList.toggle("card__like-btn_active");
        if (cardLikeCount && updatedCard.likes) {
          cardLikeCount.textContent = updatedCard.likes.length;
        }
      })
      .catch(console.error);
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  // Delete card functionality
  function handleDeleteCard(evt) {
    evt.preventDefault();
    selectedCard = cardElement;
    selectedCardId = data._id;
    
    // Update modal title to show which card is being deleted
    const modalTitle = deleteModal.querySelector(".modal__title-delete");
    if (modalTitle) {
      modalTitle.textContent = `Are you sure you want to delete "${data.name}"?`;
    }
    
    openModal(deleteModal);
  }

  cardDeleteBtn.addEventListener("click", handleDeleteCard);

  // Preview image functionality
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeModalOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeModalOnEscape);
}

// Edit Profile Form Elements
editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    Array.from(editProfileForm.querySelectorAll(".modal__input")),
    settings
  );
  openModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  
  const updatedInfo = {
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value
  };
  
  api
    .editProfileInfo(updatedInfo)
    .then((userInfo) => {
      profileNameEl.textContent = userInfo.name;
      profileDescriptionEl.textContent = userInfo.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post Form Elements
newPostBtn.addEventListener("click", function () {
  newPostForm.reset();
  resetValidation(
    newPostForm,
    Array.from(newPostForm.querySelectorAll(".modal__input")),
    settings
  );
  openModal(newPostModal);
});

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  const values = {
    name: captionInput.value,
    link: imageInput.value,
  };

  api
    .addCard(values)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

// Avatar Form Elements
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

avatarModalBtn.addEventListener("click", function () {
  avatarForm.reset();
  resetValidation(
    avatarForm,
    Array.from(avatarForm.querySelectorAll(".modal__input")),
    settings
  );
  openModal(avatarModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

// Close modal when clicking outside
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

// Enable validation
enableValidation(settings);
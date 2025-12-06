import "./index.css";
import { resetValidation } from "../scripts/validate.js";
import { enableValidation, settings } from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText, setButtonTextDelete } from "../utils/Helpers.js";

// ========== ALL DOM ELEMENTS AT THE TOP ==========
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "db10c0e2-8361-46ea-9828-124b832f271b",
    "Content-Type": "application/json",
  },
});

// Modal elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn-delete");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalTitle = deleteModal.querySelector(".modal__title-delete");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
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

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");

// State variables
let selectedCard;
let selectedCardId;
let currentUserId = null;

// ========== MODAL FUNCTIONS ==========
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

// ========== SET UP ALL CLOSE BUTTONS ==========
// Edit profile modal close
editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

// New post modal close
newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

// Preview modal close
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

// Avatar modal close
avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

// Delete modal close and cancel buttons
deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalCancelBtn.addEventListener("click", () => closeModal(deleteModal));

// Close modal when clicking outside
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

// ========== INITIAL DATA LOAD ==========
api.getUserInfo()
  .then((userInfo) => {
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;
    currentUserId = userInfo._id;
    
    return api.getInitialCards();
  })
  .then((initialCards) => {
    initialCards.forEach((card) => {
      const cardElement = createCard(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

// ========== DELETE FUNCTIONALITY ==========
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
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonTextDelete(submitBtn, false, "Delete", "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeletesubmit);

// ========== CARD CREATION FUNCTION ==========
function createCard(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  // Try to find like count element (if it exists in your template)
  let cardLikeCount = null;
  try {
    cardLikeCount = cardElement.querySelector(".card__like-count");
  } catch (e) {
  }
  
  // Set card data
  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;
  
  // Set like count if element exists
  if (cardLikeCount && cardData.likes) {
    cardLikeCount.textContent = cardData.likes.length;
  }
  
  
  // Check if current user has liked this card - FIXED VERSION
  if (cardData.likes && currentUserId) {
    const isLikedByCurrentUser = cardData.likes.some(like => {
      return like._id === currentUserId;
    });
    
    if (isLikedByCurrentUser) {
      cardLikeBtn.classList.add("card__like-btn_active");
    }
  }
  
  // Delete button - show only for user's own cards
  const isOwnCard = cardData.owner && cardData.owner._id === currentUserId;
  
  if (!isOwnCard) {
    cardDeleteBtn.style.display = "none";
  } else {
    cardDeleteBtn.style.display = "block";
  }
  
  // Like button event
  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_active");
    
    const likePromise = isLiked 
      ? api.unlikeCard(cardData._id)
      : api.likeCard(cardData._id);
    
    likePromise
      .then((updatedCard) => {
        cardLikeBtn.classList.toggle("card__like-btn_active");
        if (cardLikeCount) {
          cardLikeCount.textContent = updatedCard.likes.length;
        }
      })
      .catch((error) => {
      });
  });
  
  // Delete button event
  cardDeleteBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    selectedCard = cardElement;
    selectedCardId = cardData._id;
    
    if (deleteModalTitle) {
      deleteModalTitle.textContent = `Are you sure you want to delete "${cardData.name}"?`;
    }
    
    openModal(deleteModal);
  });
  
  // Preview image event
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = cardData.link;
    previewImageEl.alt = cardData.name;
    previewCaptionEl.textContent = cardData.name;
    openModal(previewModal);
  });
  
  return cardElement;
}

// ========== EDIT PROFILE ==========
editProfileBtn.addEventListener("click", () => {
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
  
  api.editProfileInfo({
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value
  })
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

// ========== NEW POST ==========
newPostBtn.addEventListener("click", () => {
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
  
  api.addCard({
    name: captionInput.value,
    link: imageInput.value,
  })
    .then((newCard) => {
      const cardElement = createCard(newCard);
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

// ========== AVATAR ==========
avatarModalBtn.addEventListener("click", () => {
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
  
  api.editAvatarInfo(avatarInput.value)
    .then((userInfo) => {
      profileAvatarEl.src = userInfo.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

// ========== ENABLE VALIDATION ==========
enableValidation(settings);
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

let selectedCard;
let selectedCardId;

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

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));
deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalCancelBtn.addEventListener("click", () => closeModal(deleteModal));

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

api.getUserInfo()
  .then((userInfo) => {
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatarEl.src = userInfo.avatar;
    
    return api.getInitialCards();
  })
  .then((initialCards) => {
    initialCards.forEach((card) => {
      const cardElement = createCard(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

function handleDeletesubmit(evt) {
  evt.preventDefault();
  const submitBtn = deleteForm.querySelector('button[type="submit"]');
  
  if (!selectedCardId) return;
  
  setButtonTextDelete(submitBtn, true, "Delete", "Deleting...");
  
  api.deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard && selectedCard.remove) selectedCard.remove();
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

function createCard(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  
  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;
  
  // THE 3 LINES: Check if card is liked and set initial state
  const isLiked = cardData.isLiked === true;
  if (isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }
  
  if (cardLikeCount) {
    cardLikeCount.textContent = cardData.likes ? cardData.likes.length : 0;
  }
  
  cardLikeBtn.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikeBtn.classList.contains("card__like-btn_active");
    cardLikeBtn.classList.toggle("card__like-btn_active");
    
    const likePromise = isCurrentlyLiked 
      ? api.unlikeCard(cardData._id)
      : api.likeCard(cardData._id);
    
    cardLikeBtn.disabled = true;
    
    likePromise
      .then(() => {
        cardData.isLiked = !isCurrentlyLiked;
      })
      .catch(() => {
        cardLikeBtn.classList.toggle("card__like-btn_active");
      })
      .finally(() => {
        cardLikeBtn.disabled = false;
      });
  });
  
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
  
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = cardData.link;
    previewImageEl.alt = cardData.name;
    previewCaptionEl.textContent = cardData.name;
    openModal(previewModal);
  });
  
  return cardElement;
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, Array.from(editProfileForm.querySelectorAll(".modal__input")), settings);
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

newPostBtn.addEventListener("click", () => {
  newPostForm.reset();
  resetValidation(newPostForm, Array.from(newPostForm.querySelectorAll(".modal__input")), settings);
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

avatarModalBtn.addEventListener("click", () => {
  avatarForm.reset();
  resetValidation(avatarForm, Array.from(avatarForm.querySelectorAll(".modal__input")), settings);
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

enableValidation(settings);
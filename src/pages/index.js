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

//
const cardSubmitBtn = document.querySelector(".modal__submit-btn");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

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

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Like button functionality
  function handleLike(evt, id, isLiked) {
    evt.target.classList.toggle("card__like-btn_active");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(
      evt,
      data._id,
      cardLikeBtn.classList.contains("card__like-btn_active")
    );
  });

  // Delete card functionality
  const deleteModal = document.querySelector("#delete-modal");
  const deleteForm = deleteModal.querySelector(".modal__form");

  deleteForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
  });
  let selectedCard;
  let selectedCardId;

  function handleDeleteCard(evt, cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  }

  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(evt, cardElement, data._id)
  );

  function handleDeletesubmit(evt) {
    evt.preventDefault();
    const submitBtn = evt.submitter;
    setButtonTextDelete(submitBtn, true, "Delete", "Deleting...");
    api
      .deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => {
        setButtonTextDelete(submitBtn, false, "Delete", "Deleting...");
      });
  }

  deleteForm.addEventListener("submit", handleDeletesubmit);

  // Preview image functionality
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
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

/// edit Profile Form Elements
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

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  api
    .getUserInfo()
    .then((userInfo) => {
      profileNameEl.textContent = userInfo.name;
      profileDescriptionEl.textContent = userInfo.about;
      document.querySelector(".profile__avatar").src = userInfo.avatar;
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
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

newPostForm.addEventListener("submit", handleNewPostSubmit);

document.addEventListener("keydown", closeModalOnEscape);
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

const cardElement = document.createElement("li");
cardElement.classList.add("card");

const cardImage = document.createElement("img");
cardImage.classList.add("card__image");
cardElement.appendChild(cardImage);

const cardTitle = document.createElement("h2");
cardTitle.classList.add("card__title");
cardElement.appendChild(cardTitle);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .getAppInfo()
    .then(([userInfo, initialCards, newCard]) => {
      profileNameEl.textContent = userInfo.name;
      profileDescriptionEl.textContent = userInfo.about;
      document.querySelector(".profile__avatar").src = userInfo.avatar;
      initialCards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.append(cardElement);
      });
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });

  //cardSubmitBtn.disabled = true;

  resetValidation(
    newPostForm,
    Array.from(newPostForm.querySelectorAll(".modal__input")),
    settings
  );

  const values = {
    name: captionInput.value,
    link: imageInput.value,
  };
  const cardElement = getCardElement(values);
  cardsList.prepend(cardElement);
  newPostForm.reset();
  //cardSubmitBtn.disabled = true;
  closeModal(newPostModal);
}

// Avatar Form Elements
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
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

enableValidation(settings);
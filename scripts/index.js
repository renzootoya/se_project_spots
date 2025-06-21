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
const newPostmodal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostmodal.querySelector(".modal__close-btn");
const newPostForm = newPostmodal.querySelector(".modal__form--new-post");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const imageInput = document.querySelector("#post-image-input");
const captionInput = document.querySelector("#post-caption-input");
const cardsList = document.querySelector(".cards__list");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostBtn.addEventListener("click", function () {
  imageInput.value = "";
  captionInput.value = "";
  newPostmodal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostmodal.classList.remove("modal_is-opened");
});

newPostForm.addEventListener("submit", handleNewPostSubmit);

const cardElement = document.createElement("li");
cardElement.classList.add("card");

const cardImage = document.createElement("img");
cardImage.classList.add("card__image");

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log(captionInput.value);
  console.log(imageInput.value);
  newPostmodal.classList.remove("modal_is-opened");

  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card__title");
  const cardLikeButton = document.createElement("button");
  cardLikeButton.classList.add("card__like-btn");

  cardElement.appendChild(cardImage);
  cardElement.appendChild(cardContent);
  cardContent.appendChild(cardTitle);
  cardContent.appendChild(cardLikeButton);
  cardsList.appendChild(cardElement);

  cardImage.src = imageInput.value;
  cardTitle.textContent = captionInput.value;
  newPostmodal.classList.remove("modal_is-opened");
}

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const EditProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const EditProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostmodal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostmodal.querySelector(".modal__close-btn");
const profileFormElement = newPostmodal.querySelector(".modal__form");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

editProfileBtn.addEventListener("click", function () {
  EditProfileNameInput.value = profileNameEl.textContent;
  EditProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = EditProfileNameInput.value;
  profileDescriptionEl.textContent = EditProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostBtn.addEventListener("click", function () {
  profileNameEl.value = profileNameEl.textContent;
  profileDescriptionEl.value = profileDescriptionEl.textContent;
  newPostmodal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostmodal.classList.remove("modal_is-opened");
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = profileNameEl.value;
  profileDescriptionEl.textContent = profileDescriptionEl.value;
  newPostmodal.classList.remove("modal_is-opened");
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

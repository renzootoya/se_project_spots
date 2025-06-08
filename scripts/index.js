const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfilemodal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfilemodal.querySelector(".modal__close-btn");
const EditProfileNameInput = editProfilemodal.querySelector(
  "#profile-name-input"
);
const EditProfileDescriptionInput = editProfilemodal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostmodal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostmodal.querySelector(".modal__close-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

editProfileBtn.addEventListener("click", function () {
  EditProfileNameInput.value = profileNameEl.textContent;
  EditProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfilemodal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfilemodal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function () {
  newPostmodal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostmodal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = EditProfileNameInput.value;
  profileDescriptionEl.textContent = EditProfileDescriptionInput.value;
  editProfilemodal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

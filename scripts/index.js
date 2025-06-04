const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfilemodal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfilemodal.querySelector(".modal__close-btn");

editProfileBtn.addEventListener("click", function () {
  editProfilemodal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function () {
  editProfilemodal.classList.remove("modal_is-opened");
});

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostmodal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostmodal.querySelector(".modal__close-btn");

newPostBtn.addEventListener("click", function () {
  newPostmodal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostmodal.classList.remove("modal_is-opened");
});

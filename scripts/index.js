const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfilemodal = document.querySelector("#edit-profile-modal");
const editProfileClosBtn = editProfilemodal.querySelector(".modal__close-btn");

editProfileBtn.addEventListener("click", function () {
  editProfilemodal.classList.add("modal_is-opened");
});

editProfileBtn.addEventListener("click", function () {
  editProfileClosBtn.classList.remove("modal_is-opened");
});

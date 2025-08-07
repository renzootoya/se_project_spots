const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove("modal__input_type_error");
};

function checkInputValidity(formEl, inputEl) {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
}

function setEventListeners(formEl) {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const submitButton = formEl.querySelector(".modal__button");

  // Validate all fields initially
  inputList.forEach((inputEl) => checkInputValidity(formEl, inputEl));

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl);
      /* toggleButtonState(inputList, submitButton); // Uncommented*/
    });
  });
}

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation();

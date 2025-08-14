const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(settings.inputErrorClass);
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
};

function checkInputValidity(formEl, inputEl) {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputEl) => {
    return !inputEl.validity.valid;
  });
};

// Add console.logs to check functions
const toggleButtonState = (inputList, buttonEl, settings) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, settings);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(settings.inactiveButtonClass);
  }
};

const disableButton = (buttonEl, settings) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(settings.inactiveButtonClass);
};

const resetValidation = (formEl, inputList, settings) => {
  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl);
  });
  const submitButton = formEl.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputList, submitButton, settings);
};

function setEventListeners(formEl, settings) {
  const inputList = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const submitButton = formEl.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, submitButton, settings);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl);
      toggleButtonState(inputList, submitButton, settings);
    });
  });
}

const enableValidation = (settings) => {
  const formList = document.querySelectorAll(settings.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, settings);
  });
};

enableValidation(settings);

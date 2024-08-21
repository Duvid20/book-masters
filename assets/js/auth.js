const subHeaderTexts = [
  "Choose your username",
  "Enter your email",
  "Verify your email",
  "Set your password",
  "Enter your full name",
];

let currentRegisterStep = 0;
let currentLoginStep = 0;

document.addEventListener("DOMContentLoaded", function () {
  console.log("auth.js DOMContentLoaded");

  function showUserInputMsg(inputAreaId, isError, msg, msgClass) {
    // input area
    const inputAreaDiv = document.getElementById(inputAreaId);

    // message container
    let msgContainerDiv = inputAreaDiv.querySelector(
      ".user-input-msg-container"
    );
    if (!msgContainerDiv) {
      msgContainerDiv = document.createElement("div");
      msgContainerDiv.classList.add("user-input-msg-container");
      inputAreaDiv.appendChild(msgContainerDiv);

      // insert msgContainerDiv before button
      const button = inputAreaDiv.querySelector("button");
      inputAreaDiv.insertBefore(msgContainerDiv, button);
    }

    // remove other messages with the same msgClass
    const otherMsgs = msgContainerDiv.querySelectorAll(`.${msgClass}`);
    otherMsgs.forEach((msg) => {
      msg.remove();
    });

    // message
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("user-input-msg");
    msgDiv.classList.add(msgClass);

    const msgIconDiv = document.createElement("div");
    msgIconDiv.classList.add("user-input-msg-icon");

    switch (isError) {
      case undefined:
        msgDiv.classList.add("user-input-msg-neutral");
        msgIconDiv.innerHTML = "i";
        break;
      case true:
        msgDiv.classList.add("user-input-msg-error");
        msgIconDiv.innerHTML = "✕";
        break;
      case false:
        msgDiv.classList.add("user-input-msg-success");
        msgIconDiv.innerHTML = "✓";
        break;
    }

    msgDiv.appendChild(msgIconDiv);
    msgDiv.innerHTML += msg;
    msgContainerDiv.appendChild(msgDiv);
  }

  function deleteUserInputMsg(inputAreaId, msgClass) {
    const inputAreaDiv = document.getElementById(inputAreaId);
    const msgContainerDiv = inputAreaDiv.querySelector(
      ".user-input-msg-container"
    );
    const msgDiv = msgContainerDiv.querySelector(`.${msgClass}`);
    msgDiv.remove();
  }

  function checkIfInputAlreadyExists(
    inputFieldName,
    nameString,
    inputFieldElementId,
    url,
    inputAreaId,
    msgClass
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `${inputFieldName}=${value}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showUserInputMsg(
            inputAreaId,
            false,
            `${nameString} available`,
            msgClass
          );
          return false;
        } else {
          showUserInputMsg(
            inputAreaId,
            true,
            `${nameString} already in use`,
            msgClass
          );
          return true;
        }
      });
  }

  function checkHasInputWrongLength(
    nameString,
    inputFieldElementId,
    minLength,
    inputAreaId,
    msgClass
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();
    if (value.length < minLength) {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `${nameString} must be ${minLength}+ characters`,
        msgClass
      );
      return true;
    }
    return false;
  }

  function checkEmailFormat(inputFieldElementId, inputAreaId, msgClass) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (!emailRegex.test(value)) {
      showUserInputMsg(
        inputAreaId,
        true,
        "Email must be right format",
        msgClass
      );
      return true;
    }
    return false;
  }

  function isInputEmpty(
    nameString,
    inputFieldElementId,
    inputAreaId,
    msgClass
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (value === "") {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `Enter your ${nameString}`,
        msgClass
      );
      return true;
    }
    return false;
  }

  function checkValuesMatch(
    nameString,
    inputFieldElementId1,
    inputFieldElementId2,
    inputAreaId,
    msgClass
  ) {
    const inputFieldElement1 = document.getElementById(inputFieldElementId1);
    const inputFieldElement2 = document.getElementById(inputFieldElementId2);
    const value1 = inputFieldElement1.value.trim();
    const value2 = inputFieldElement2.value.trim();

    if (value1 != value2) {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `${nameString} have to match`,
        msgClass
      );
      return false;
    } else {
      showUserInputMsg(inputAreaId, false, `${nameString} match`, msgClass);
      return true;
    }
  }

  function containsChars(value, chars) {
    const regex = new RegExp(`[${chars}]`);
    return regex.test(value);
  }

  function checkValueContainsChars(
    chars,
    inputFieldElementId,
    inputAreaId,
    msgClass
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (!containsChars(value, chars)) {
      showUserInputMsg(
        inputAreaId,
        true,
        "Password must contain " + chars,
        msgClass
      );
      return false;
    } else {
      showUserInputMsg(
        inputAreaId,
        false,
        "Password contains " + chars,
        msgClass
      );
      return true;
    }
  }

  function checkUsernameInput() {
    const buttonElement = document.getElementById("register-username-btn");
    setDisabled(buttonElement, true);

    let isEmpty = isInputEmpty(
      "username",
      "register-username-input",
      "register-username",
      "is-username-available"
    );

    if (!isEmpty) {
      let hasWrongLength = checkHasInputWrongLength(
        "Username",
        "register-username-input",
        3,
        "register-username",
        "is-username-available"
      );

      if (!hasWrongLength) {
        let inputAlreadyExists = checkIfInputAlreadyExists(
          "username",
          "Username",
          "register-username-input",
          "/includes/auth/check-username.php",
          "register-username",
          "is-username-available"
        );

        if (!inputAlreadyExists) {
          setDisabled(buttonElement, false);
        }
      }
    }
  }

  function checkEmailInput() {
    const buttonElement = document.getElementById("register-email-btn");
    setDisabled(buttonElement, true);

    let isEmpty = isInputEmpty(
      "email",
      "register-email-input",
      "register-email",
      "is-email-available"
    );

    if (!isEmpty) {
      let hasWrongFormat = checkEmailFormat(
        "register-email-input",
        "register-email",
        "is-email-available"
      );

      if (!hasWrongFormat) {
        let inputAlreadyExists = checkIfInputAlreadyExists(
          "email",
          "Email",
          "register-email-input",
          "/includes/auth/check-email.php",
          "register-email",
          "is-email-available"
        );

        if (!inputAlreadyExists) {
          setDisabled(buttonElement, false);
        }
      }
    }
  }

  function checkPasswordInput() {
    const passwordMinimumLength = 14;
    const buttonElement = document.getElementById("register-password-btn");
    setDisabled(buttonElement, true);
    let hasWrongLength = true;

    const isEmpty = isInputEmpty(
      "Password",
      "register-password-input",
      "register-password",
      "is-password-correct"
    );

    if (!isEmpty) {
      hasWrongLength = checkHasInputWrongLength(
        "Password",
        "register-password-input",
        passwordMinimumLength,
        "register-password",
        "is-password-correct"
      );
    }

    const containsLowercase = checkValueContainsChars(
      "a-z",
      "register-password-input",
      "register-password",
      "password-lowercase"
    );

    const containsUppercase = checkValueContainsChars(
      "A-Z",
      "register-password-input",
      "register-password",
      "password-uppercase"
    );

    const containsNumber = checkValueContainsChars(
      "0-9",
      "register-password-input",
      "register-password",
      "password-number"
    );

    const containsSpecialChars = checkValueContainsChars(
      "@$!%*?&",
      "register-password-input",
      "register-password",
      "password-special-chars"
    );

    if (
      containsLowercase &&
      containsUppercase &&
      containsNumber &&
      containsSpecialChars &&
      !isEmpty &&
      !hasWrongLength
    ) {
      const areValuesMatching = checkValuesMatch(
        "Passwords",
        "register-password-input",
        "register-password-confirm-input",
        "register-password",
        "is-password-correct"
      );

      if (areValuesMatching) {
        setDisabled(buttonElement, false);
      }
    }
  }

  function checkFullNameInput() {
    console.log("checkFullNameInput");
    const buttonElement = document.getElementById("register-full-name-btn");
    setDisabled(buttonElement, true);

    const isGivenNameEmpty = isInputEmpty(
      "Given name(s)",
      "register-given-name-input",
      "register-full-name",
      "is-given-name-correct"
    );

    const isFamilyNameEmpty = isInputEmpty(
      "Family name",
      "register-family-name-input",
      "register-full-name",
      "is-family-name-correct"
    );

    if (!isGivenNameEmpty) {
      showUserInputMsg(
        "register-given-name-input",
        false,
        "Beautiful given name!",
        "is-given-name-correct"
      );
    }

    if (!isFamilyNameEmpty) {
      showUserInputMsg(
        "register-family-name-input",
        false,
        "Beautiful family name!",
        "is-family-name-correct"
      );
    }

    console.log("isGivenNameEmpty", isGivenNameEmpty);
    console.log("isFamilyNameEmpty", isFamilyNameEmpty);

    if (!isGivenNameEmpty && !isFamilyNameEmpty) {
      setDisabled(buttonElement, false);
    }
  }

  function showNextRegisterStep() {
    if (currentRegisterStep < userInputAreasRegister.length - 1) {
      checkUsernameInput();
      checkEmailInput();

      userInputAreasRegister[currentRegisterStep].classList.remove("active");
      currentRegisterStep++;
      userInputAreasRegister[currentRegisterStep].classList.add("active");

      // show back-button
      registerBackButton.style.display = "block";

      // change sub header text
      registerSubHeader.innerHTML = subHeaderTexts[currentRegisterStep];
    }
  }

  function showPreviousRegisterStep() {
    if (currentRegisterStep > 0) {
      checkUsernameInput();
      checkEmailInput();

      userInputAreasRegister[currentRegisterStep].classList.remove("active");
      currentRegisterStep--;
      userInputAreasRegister[currentRegisterStep].classList.add("active");

      // hide back-button if on first step
      if (currentRegisterStep === 0) {
        registerBackButton.style.display = "none";
      }

      // change sub header text
      registerSubHeader.innerHTML = subHeaderTexts[currentRegisterStep];
    }
  }

  // init dom elements
  const buttonsRegister = document.querySelectorAll(".button-register");
  const registerBackButton = document.getElementById("register-back-btn");

  const userInputAreasRegister = document.querySelectorAll(
    ".user-input-area-register"
  );

  const registerUsernameInput = document.getElementById(
    "register-username-input"
  );
  const registerEmailInput = document.getElementById("register-email-input");
  const registerPasswordInput = document.getElementById(
    "register-password-input"
  );
  const registerPasswordConfirmInput = document.getElementById(
    "register-password-confirm-input"
  );
  const registerGivenNameInput = document.getElementById(
    "register-given-name-input"
  );
  const registerFamilyNameInput = document.getElementById(
    "register-family-name-input"
  );

  const registerSubHeader = document.getElementById("register-sub-header");

  // initial check
  checkUsernameInput();
  checkEmailInput();
  checkPasswordInput();
  checkFullNameInput();

  // event listeners
  buttonsRegister.forEach((button) => {
    button.addEventListener("click", showNextRegisterStep);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "ArrowRight") {
      showNextRegisterStep();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      showPreviousRegisterStep();
    }
  });

  registerUsernameInput.addEventListener("input", checkUsernameInput);
  registerEmailInput.addEventListener("input", checkEmailInput);
  registerPasswordInput.addEventListener("input", checkPasswordInput);
  registerPasswordConfirmInput.addEventListener("input", checkPasswordInput);
  registerGivenNameInput.addEventListener("input", checkFullNameInput);
  registerFamilyNameInput.addEventListener("input", checkFullNameInput);

  registerBackButton.addEventListener("click", showPreviousRegisterStep);

  // // sending email
  // document
  //   .getElementById("send-email-btn")
  //   .addEventListener("click", function () {
  //     const to = "recipient@example.com";
  //     const subject = "Test Email";
  //     const message = "This is a test email sent from JavaScript.";
  //     sendEmail(to, subject, message);
  //   });
});

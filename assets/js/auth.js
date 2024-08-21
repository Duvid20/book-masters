const subHeaderTexts = [
  "Choose your username",
  "Enter your email",
  "Verify your email",
  "Set your password",
];

let currentRegisterStep = 0;
let currentLoginStep = 0;

document.addEventListener("DOMContentLoaded", function () {
  console.log("auth.js DOMContentLoaded");

  function showUserInputMsg(inputAreaId, isError, msg, msgType) {
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

    // remove other messages with the same msgType
    const otherMsgs = msgContainerDiv.querySelectorAll(`.${msgType}`);
    otherMsgs.forEach((msg) => {
      msg.remove();
    });

    // message
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("user-input-msg");
    msgDiv.classList.add(msgType);

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

  function deleteUserInputMsg(inputAreaId, msgType) {
    const inputAreaDiv = document.getElementById(inputAreaId);
    const msgContainerDiv = inputAreaDiv.querySelector(
      ".user-input-msg-container"
    );
    const msgDiv = msgContainerDiv.querySelector(`.${msgType}`);
    msgDiv.remove();
  }

  function checkIfInputAlreadyExists(
    inputFieldName,
    nameString,
    inputFieldElementId,
    url,
    inputAreaId,
    msgType
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
            msgType
          );
          return false;
        } else {
          showUserInputMsg(
            inputAreaId,
            true,
            `${nameString} already in use`,
            msgType
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
    msgType
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();
    if (value.length < minLength) {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `${nameString} must be ${minLength}+ characters`,
        msgType
      );
      return true;
    } else {
      return false;
    }
  }

  function checkEmailFormat(inputFieldElementId, inputAreaId, msgType) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (!emailRegex.test(value)) {
      showUserInputMsg(
        inputAreaId,
        true,
        "Email must be right format",
        msgType
      );
      return true;
    }
    return false;
  }

  function isInputEmpty(nameString, inputFieldElementId, inputAreaId, msgType) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (value === "") {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `Enter your ${nameString}`,
        msgType
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
    msgType
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
        msgType
      );
      return false;
    } else {
      showUserInputMsg(inputAreaId, false, `${nameString} match`, msgType);
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
    msgType
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (!containsChars(value, chars)) {
      showUserInputMsg(
        inputAreaId,
        true,
        "Password must contain " + chars,
        msgType
      );
      return false;
    } else {
      showUserInputMsg(
        inputAreaId,
        false,
        "Password contains " + chars,
        msgType
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

    let isEmpty = isInputEmpty(
      "Password",
      "register-password-input",
      "register-password",
      "is-password-correct"
    );

    let hasWrongLength = true;

    if (!isEmpty) {
      hasWrongLength = checkHasInputWrongLength(
        "Password",
        "register-password-input",
        passwordMinimumLength,
        "register-password",
        "is-password-correct"
      );
    }

    console.log("containsLowercase", containsLowercase);
    console.log("containsUppercase", containsUppercase);
    console.log("containsNumber", containsNumber);
    console.log("containsSpecialChars", containsSpecialChars);
    console.log("isEmpty", isEmpty);
    console.log("hasWrongLength", hasWrongLength);

    if (
      containsLowercase &&
      containsUppercase &&
      containsNumber &&
      containsSpecialChars &&
      !isEmpty &&
      !hasWrongLength
    ) {
      console.log("now checking if passwords match");
      let areValuesMatching = checkValuesMatch(
        "Passwords",
        "register-password-input",
        "register-password-confirm-input",
        "register-password",
        "is-password-correct"
      );

      if (areValuesMatching) {
        console.log("passwords match, checking if");

        setDisabled(buttonElement, false);
      }
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

  function showNextLoginStep() {
    if (currentLoginStep < userInputAreasLogin.length - 1) {
      userInputAreasRegister[currentLoginStep].classList.remove("active");
      currentLoginStep++;
      userInputAreasRegister[currentLoginStep].classList.add("active");
    }
  }

  // init dom elements
  const buttonsRegister = document.querySelectorAll(".button-register");
  const buttonsLogin = document.querySelectorAll(".button-login");
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

  const registerSubHeader = document.getElementById("register-sub-header");

  // initial check
  checkUsernameInput();
  checkEmailInput();
  checkPasswordInput();

  // iterate through register page steps
  buttonsRegister.forEach((button) => {
    button.addEventListener("click", showNextRegisterStep);
  });

  // iterate through login page steps
  buttonsLogin.forEach((button) => {
    button.addEventListener("click", showNextLoginStep);
  });

  // check if username is available and correct length
  registerUsernameInput.addEventListener("input", checkUsernameInput);
  registerEmailInput.addEventListener("input", checkEmailInput);
  registerPasswordInput.addEventListener("input", () => {
    checkPasswordInput();
  });
  registerPasswordConfirmInput.addEventListener("input", () => {
    checkPasswordInput();
  });

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

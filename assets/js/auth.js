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

  function checkIfInputAlreadyExists(
    inputFieldName,
    nameString,
    inputFieldElementId,
    buttonElementId,
    url,
    inputAreaId,
    msgType
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();
    const buttonElement = document.getElementById(buttonElementId);

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
          setDisabled(buttonElement, false);
        } else {
          showUserInputMsg(
            inputAreaId,
            true,
            `${nameString} already in use`,
            msgType
          );
          setDisabled(buttonElement, true);
        }
      });
  }

  function checkInputLength(
    nameString,
    inputFieldElementId,
    buttonElementId,
    minLength,
    inputAreaId,
    msgType
  ) {
    const buttonElement = document.getElementById(buttonElementId);
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();
    if (value.length < minLength) {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `${nameString} must be ${minLength}+ characters`,
        msgType
      );
      setDisabled(buttonElement, true);
      return true;
    }
    return false;
  }

  function checkEmailFormat(
    inputFieldElementId,
    buttonElementId,
    inputAreaId,
    msgType
  ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const buttonElement = document.getElementById(buttonElementId);
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const value = inputFieldElement.value.trim();

    if (!emailRegex.test(value)) {
      showUserInputMsg(
        inputAreaId,
        true,
        "Email must be right format",
        msgType
      );
      setDisabled(buttonElement, true);
      return true;
    }
    return false;
  }

  function isInputEmpty(
    nameString,
    inputFieldElementId,
    buttonElementId,
    inputAreaId,
    msgType
  ) {
    const inputFieldElement = document.getElementById(inputFieldElementId);
    const buttonElement = document.getElementById(buttonElementId);
    const value = inputFieldElement.value.trim();

    if (value === "") {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `Enter your ${nameString}`,
        msgType
      );
      setDisabled(buttonElement, true);
      return true;
    }
    return false;
  }

  function checkUsernameInput() {
    let isEmpty = isInputEmpty(
      "username",
      "register-username-input",
      "register-username-btn",
      "register-username",
      "is-username-available"
    );

    if (!isEmpty) {
      let hasWrongLength = checkInputLength(
        "Username",
        "register-username-input",
        "register-username-btn",
        3,
        "register-username",
        "is-username-available"
      );

      if (!hasWrongLength) {
        checkIfInputAlreadyExists(
          "username",
          "Username",
          "register-username-input",
          "register-username-btn",
          "/includes/auth/check-username.php",
          "register-username",
          "is-username-available"
        );
      }
    }
  }

  function checkEmailInput() {
    let isEmpty = isInputEmpty(
      "email",
      "register-email-input",
      "register-email-btn",
      "register-email",
      "is-email-available"
    );

    if (!isEmpty) {
      let hasWrongFormat = checkEmailFormat(
        "register-email-input",
        "register-email-btn",
        "register-email",
        "is-email-available"
      );

      if (!hasWrongFormat) {
        checkIfInputAlreadyExists(
          "email",
          "Email",
          "register-email-input",
          "register-email-btn",
          "/includes/auth/check-email.php",
          "register-email",
          "is-email-available"
        );
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

      // hide back-button
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
  const registerSubHeader = document.getElementById("register-sub-header");
  const subHeaderTexts = [
    "Choose your username",
    "Enter your email",
    "Verify your email",
    "Set your password",
  ];

  let currentRegisterStep = 0;
  let currentLoginStep = 0;

  // initial check
  checkUsernameInput();
  checkEmailInput();

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

  registerBackButton.addEventListener("click", showPreviousRegisterStep);

  // sending email
  document
    .getElementById("send-email-btn")
    .addEventListener("click", function () {
      const to = "recipient@example.com";
      const subject = "Test Email";
      const message = "This is a test email sent from JavaScript.";
      sendEmail(to, subject, message);
    });
});

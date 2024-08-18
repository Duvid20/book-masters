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
        msgIconDiv.innerHTML = "◬";
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

  function checkInput(
    inputFieldName,
    nameString,
    inputFieldElement,
    buttonElementId,
    url,
    minLength,
    inputAreaId,
    msgType
  ) {
    const value = inputFieldElement.value;
    const buttonElement = document.getElementById(buttonElementId);

    if (value.length < minLength) {
      showUserInputMsg(
        inputAreaId,
        undefined,
        `${nameString} must be ${minLength}+ characters`,
        msgType
      );
      setDisabled(buttonElement, true);
      return;
    }

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

  function checkUsernameInput() {
    checkInput(
      "username",
      "Username",
      registerUsernameInput,
      "register-username-btn",
      "/includes/auth/check-username.php",
      3,
      "register-username",
      "is-username-available"
    );
  }

  // init dom elements
  const buttonsRegister = document.querySelectorAll(".button-register");
  const buttonsLogin = document.querySelectorAll(".button-login");

  const userInputAreasRegister = document.querySelectorAll(
    ".user-input-area-register"
  );
  const registerUsernameInput = document.getElementById(
    "register-username-input"
  );

  let currentRegisterStep = 0;
  let currentLoginStep = 0;

  function showNextRegisterStep() {
    if (currentRegisterStep < userInputAreasRegister.length - 1) {
      userInputAreasRegister[currentRegisterStep].classList.remove("active");
      currentRegisterStep++;
      userInputAreasRegister[currentRegisterStep].classList.add("active");
    }
  }

  function showNextLoginStep() {
    if (currentLoginStep < userInputAreasLogin.length - 1) {
      userInputAreasRegister[currentLoginStep].classList.remove("active");
      currentLoginStep++;
      userInputAreasRegister[currentLoginStep].classList.add("active");
    }
  }

  // initial check of inputs
  checkUsernameInput();

  // iterate through register page steps
  buttonsRegister.forEach((button) => {
    button.addEventListener("click", showNextRegisterStep);
  });

  // iterate through login page steps
  buttonsLogin.forEach((button) => {
    button.addEventListener("click", showNextLoginStep);
  });

  // check if username is available and correct length
  registerUsernameInput.addEventListener("input", function () {
    checkUsernameInput();
  });
});

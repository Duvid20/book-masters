document.addEventListener("DOMContentLoaded", function () {
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

      // insert before button
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
        msgIconDiv.innerHTML = "?";
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

  function checkUsername() {
    const username = registerUsernameInput.value;

    // check if username fulfills requirements
    if (username.length < 3) {
      showUserInputMsg(
        "register-username",
        undefined,
        "Username must be 3 or more chars",
        "is-username-available"
      );
      return;
    }

    // check if username is already in use
    fetch("/includes/auth/check-username.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${username}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showUserInputMsg(
            "register-username",
            false,
            "Username available",
            "is-username-available"
          );
        } else {
          showUserInputMsg(
            "register-username",
            true,
            "Username already in use",
            "is-username-available"
          );
        }
      });
  }

  const dataFetchInvetval = 300;
  let debounceTimeoutUsername;

  // init dom elements
  const registerUsernameInput = document.getElementById(
    "register-username-input"
  );
  const userInputAreasRegister = document.querySelectorAll(
    ".user-input-area-register"
  );
  const buttonsRegister = document.querySelectorAll(".button-register");

  buttonsRegister.forEach((button) => {
    button.addEventListener("click", showNextRegisterStep);
  });

  // iterate through register steps
  let currentStep = 0;
  function showNextRegisterStep() {
    if (currentStep < userInputAreasRegister.length - 1) {
      userInputAreasRegister[currentStep].classList.remove("active");
      currentStep++;
      userInputAreasRegister[currentStep].classList.add("active");
    }
  }

  // check whether or not username is already in use every x ms
  registerUsernameInput.addEventListener("input", function () {
    clearTimeout(debounceTimeoutUsername);
    debounceTimeoutUsername = setTimeout(checkUsername, dataFetchInvetval);
  });
});

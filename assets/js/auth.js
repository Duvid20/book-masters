let buttonsRegister,
  registerBackButton,
  userInputAreasRegister,
  registerUsernameInput,
  registerEmailInput,
  registerPasswordInput,
  registerPasswordConfirmInput,
  registerGivenNameInput,
  registerFamilyNameInput,
  registerSubHeader,
  toLoginButton;

let loginUsernameOrEmailInput,
  loginPasswordInput,
  loginButton,
  toRegisterButton;

let currentRegisterStep = 0;
const registerSubHeaderTexts = [
  "Choose your username",
  "Enter your email",
  "Verify your email",
  "Set your password",
  "Enter your full name",
];

async function checkPasswordPwned(password) {
  try {
    const sha1 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", sha1);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5).toUpperCase();

    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );

    if (!response.ok) {
      // throw new Error(`Network response was not ok: ${response.statusText}`);
      return -1;
    }

    const text = await response.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [hashSuffix, count] = line.split(":");
      if (hashSuffix === suffix) {
        return parseInt(count, 10);
      }
    }

    return 0;
  } catch (error) {
    return -1; // Indicate that the check failed
  }
}

function showUserInputMsg(inputAreaId, isError, msg, msgClass) {
  // input area
  const inputAreaDiv = document.getElementById(inputAreaId);

  // message container
  let msgContainerDiv = inputAreaDiv.querySelector(".user-input-msg-container");
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

function deleteUserInputMsgIfExists(inputAreaId, msgClass) {
  const inputAreaDiv = document.getElementById(inputAreaId);
  const msgContainerDiv = inputAreaDiv.querySelector(
    ".user-input-msg-container"
  );

  if (msgContainerDiv) {
    const msgDiv = msgContainerDiv.querySelector(`.${msgClass}`);

    if (msgDiv) {
      msgDiv.remove();
    }
  }
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

  return fetch(url, {
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
  const inputFieldElement = document.getElementById(inputFieldElementId);
  const value = inputFieldElement.value.trim();

  if (!isEmailValid(value)) {
    showUserInputMsg(inputAreaId, true, "Email must be right format", msgClass);
    return true;
  }
  return false;
}

function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isInputEmpty(nameString, inputFieldElementId, inputAreaId, msgClass) {
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
      undefined,
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

function checkUsernameInputRegister() {
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
      checkIfInputAlreadyExists(
        "username",
        "Username",
        "register-username-input",
        "/includes/fetches/check-username.php",
        "register-username",
        "is-username-available"
      ).then((inputAlreadyExists) => {
        if (!inputAlreadyExists) {
          setDisabled(buttonElement, false);
        }
      });
    }
  }
}

function checkEmailInputRegister() {
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
      checkIfInputAlreadyExists(
        "email",
        "Email",
        "register-email-input",
        "/includes/fetches/check-email.php",
        "register-email",
        "is-email-available"
      ).then((inputAlreadyExists) => {
        if (!inputAlreadyExists) {
          setDisabled(buttonElement, false);
        }
      });
    }
  }
}

function checkPasswordInputRegister() {
  const passwordMinimumLength = 14;
  const buttonElement = document.getElementById("register-password-btn");
  setDisabled(buttonElement, true);
  deleteUserInputMsgIfExists("register-password", "password-pwned");
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
    "@$§%*&/!?~\\-_.,+#()\\[\\]{}",
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
      const password = document.getElementById("register-password-input").value;
      buttonElement.innerHTML = "Checking...";

      checkPasswordPwned(password).then((count) => {
        if (count > 0) {
          // password has been pwned
          console.log(`Password has been pwned ${count} times`);
          showUserInputMsg(
            "register-password",
            true,
            `Password pwned ${count} times`,
            "password-pwned"
          );
        } else if (count === 0) {
          // password has not been pwned
          showUserInputMsg(
            "register-password",
            false,
            "Password is safe",
            "password-pwned"
          );
          setDisabled(buttonElement, false);
        } else {
          // error occured when pwning (e.g. user offline)
          showUserInputMsg(
            "register-password",
            false,
            "Password is safe",
            "password-pwned"
          );
          deleteUserInputMsgIfExists("register-password", "password-pwned");
          setDisabled(buttonElement, false);
        }
        buttonElement.innerHTML = "Continue";
      });
    }
  }
}

function checkFullNameInputRegister() {
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

  if (!isFamilyNameEmpty) {
    deleteUserInputMsgIfExists("register-full-name", "is-family-name-correct");
  }

  if (!isGivenNameEmpty) {
    deleteUserInputMsgIfExists("register-full-name", "is-given-name-correct");
  }

  if (!isGivenNameEmpty && !isFamilyNameEmpty) {
    setDisabled(buttonElement, false);
  }
}

function showNextRegisterStep() {
  if (currentRegisterStep < userInputAreasRegister.length - 1) {
    checkUsernameInputRegister();
    checkEmailInputRegister();

    userInputAreasRegister[currentRegisterStep].classList.remove("active");
    currentRegisterStep++;
    userInputAreasRegister[currentRegisterStep].classList.add("active");

    // show back-button
    registerBackButton.style.display = "block";

    // change sub header text
    registerSubHeader.innerHTML = registerSubHeaderTexts[currentRegisterStep];
  }
}

function showPreviousRegisterStep() {
  if (currentRegisterStep > 0) {
    checkUsernameInputRegister();
    checkEmailInputRegister();

    userInputAreasRegister[currentRegisterStep].classList.remove("active");
    currentRegisterStep--;
    userInputAreasRegister[currentRegisterStep].classList.add("active");

    // hide back-button if on first step
    if (currentRegisterStep === 0) {
      registerBackButton.style.display = "none";
    }

    // change sub header text
    registerSubHeader.innerHTML = registerSubHeaderTexts[currentRegisterStep];
  }
}

function checkAllRegisterInputs() {
  checkUsernameInputRegister();
  checkEmailInputRegister();
  checkPasswordInputRegister();
  checkFullNameInputRegister();
}

function checkUsernameOrEmailInputLogin() {
  const buttonElement = document.getElementById("login-btn");
  setDisabled(buttonElement, true);

  const isEmpty = isInputEmpty(
    "username or email",
    "login-username-or-email-input",
    "login-username-email-password",
    "is-username-or-email-correct"
  );

  if (!isEmpty) {
    deleteUserInputMsgIfExists(
      "login-username-email-password",
      "is-username-or-email-correct"
    );
    setDisabled(buttonElement, false);
  }
}

function checkPasswordInputLogin() {
  const buttonElement = document.getElementById("login-btn");
  setDisabled(buttonElement, true);

  const isEmpty = isInputEmpty(
    "password",
    "login-password-input",
    "login-username-email-password",
    "is-password-correct"
  );

  if (!isEmpty) {
    deleteUserInputMsgIfExists(
      "login-username-email-password",
      "is-password-correct"
    );
    setDisabled(buttonElement, false);
  }
}

function checkAllLoginInputs() {
  checkUsernameOrEmailInputLogin();
  checkPasswordInputLogin();
}

function initRegister() {
  // init dom elements
  buttonsRegister = document.querySelectorAll(".button-register");
  registerBackButton = document.getElementById("register-back-btn");

  userInputAreasRegister = document.querySelectorAll(
    ".user-input-area-register"
  );

  registerUsernameInput = document.getElementById("register-username-input");
  registerEmailInput = document.getElementById("register-email-input");
  registerPasswordInput = document.getElementById("register-password-input");
  registerPasswordConfirmInput = document.getElementById(
    "register-password-confirm-input"
  );
  registerGivenNameInput = document.getElementById("register-given-name-input");
  registerFamilyNameInput = document.getElementById(
    "register-family-name-input"
  );

  registerSubHeader = document.getElementById("register-sub-header");

  toLoginButton = document.getElementById("to-login-btn");

  // initial check
  checkAllRegisterInputs();

  // event listeners
  buttonsRegister.forEach((button) => {
    button.addEventListener("click", showNextRegisterStep);
  });

  registerUsernameInput.addEventListener("input", checkUsernameInputRegister);
  registerEmailInput.addEventListener("input", checkEmailInputRegister);
  registerPasswordInput.addEventListener("input", checkPasswordInputRegister);
  registerPasswordConfirmInput.addEventListener(
    "input",
    checkPasswordInputRegister
  );
  registerGivenNameInput.addEventListener("input", checkFullNameInputRegister);
  registerFamilyNameInput.addEventListener("input", checkFullNameInputRegister);

  registerBackButton.addEventListener("click", () => {
    showPreviousRegisterStep();
    checkAllRegisterInputs();
  });

  // redirect to login page and prefill
  toLoginButton.addEventListener("click", () => {
    console.log("to login");
    const username = registerUsernameInput.value;
    const email = registerEmailInput.value;

    fetch("includes/fetches/to-login-and-prefill.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${username}&email=${email}`,
    }).then(() => {
      reloadPage();
    });
  });
}

function initLogin() {
  // init dom elements
  loginUsernameOrEmailInput = document.getElementById(
    "login-username-or-email-input"
  );
  loginPasswordInput = document.getElementById("login-password-input");
  loginButton = document.getElementById("login-btn");
  toRegisterButton = document.getElementById("to-register-btn");

  // initial check
  checkAllLoginInputs();

  // event listeners
  loginUsernameOrEmailInput.addEventListener(
    "input",
    checkUsernameOrEmailInputLogin
  );
  loginPasswordInput.addEventListener("input", checkPasswordInputLogin);

  // redirect to register page and prefill
  toRegisterButton.addEventListener("click", () => {
    const usernameOrEmail = loginUsernameOrEmailInput.value;
    const postBody = isEmailValid(usernameOrEmail)
      ? `email=${usernameOrEmail}`
      : `username=${usernameOrEmail}`;

    fetch("includes/fetches/to-register-and-prefill.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postBody,
    }).then(() => {
      reloadPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // prevent spaces in password and email inputs
  document
    .querySelectorAll('input[type="password"], input[type="email"]')
    .forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }
      });
    });
});

// // sending email
// document
//   .getElementById("send-email-btn")
//   .addEventListener("click", function () {
//     const to = "recipient@example.com";
//     const subject = "Test Email";
//     const message = "This is a test email sent from JavaScript.";
//     sendEmail(to, subject, message);
//   });

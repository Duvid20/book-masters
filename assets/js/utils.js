function setDisabled(elem, disabled) {
  if (elem) {
    if (disabled) {
      elem.setAttribute("disabled", "disabled");
    } else {
      elem.removeAttribute("disabled");
    }
  } else {
    console.error("Element is null");
  }
}

function sendEmail(to, subject, message) {
  fetch("/includes/auth/send-email.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `to=${encodeURIComponent(to)}&subject=${encodeURIComponent(
      subject
    )}&message=${encodeURIComponent(message)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Email sent successfully");
      } else {
        console.log("Failed to send email");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

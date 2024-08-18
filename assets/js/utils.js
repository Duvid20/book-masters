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

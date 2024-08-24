window.addEventListener("DOMContentLoaded", function () {
  console.log("online:", this.navigator.onLine);

  // check if online with eventlistener
  window.addEventListener("online", () => {
    console.log("You are online");
  });
  window.addEventListener("offline", () => {
    console.log("You are offline");
  });
});

let contentDiv;
let navItems;

function loadContent(page) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `includes/fetches/load-content.php?page=${page}`, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      contentDiv.innerHTML = xhr.responseText;
    }
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {
  navItems = document.querySelectorAll(".nav-item");
  contentDiv = document.getElementById("content");

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");

      // load corresponding content
      const page = this.id.replace("nav-", "").replace("-btn", "");
      loadContent(page);
    });
  });
});

  var menuToggle = document.querySelector("#menu-toggle");
  var menu = document.querySelector("#menu");
  var FilterMenuToggle = document.querySelector("#filter-menu-toggle");
  var FilterMenu = document.querySelector("#filter-menu");
  var site = document.querySelector("body");

  menuToggle.addEventListener("click", function (event) {
    var menuOpen = menu.classList.contains("is-active");
    menuToggle.classList.toggle("is-active");
    menu.classList.toggle("is-active");
    site.classList.toggle("menu-open");
    FilterMenuToggle.classList.remove("filter-is-active");
    FilterMenu.classList.remove("filter-is-active");
    site.classList.remove("filter-menu-open");
  });

  FilterMenuToggle.addEventListener("click", function (event) {
    var FilterMenuOpen = menu.classList.contains("filter-is-active");
    FilterMenuToggle.classList.toggle("filter-is-active");
    FilterMenu.classList.toggle("filter-is-active");
    site.classList.toggle("filter-menu-open");
    menuToggle.classList.remove("is-active");
    menu.classList.remove("is-active");
    site.classList.remove("menu-open");
  });
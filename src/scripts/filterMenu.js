const menuToggle = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");
const FilterMenuToggle = document.querySelector("#filter-menu-toggle");
const FooterFilterMenuToggle = document.querySelector("#footer-filter-menu-toggle");
const FilterMenu = document.querySelector("#filter-menu");
const site = document.querySelector("body");

if (menuToggle) {
  menuToggle.addEventListener("click", function(event) {
    menuToggle.classList.toggle("is-active");
    menu.classList.toggle("is-active");
    site.classList.toggle("menu-open");
    if (FilterMenuToggle) FilterMenuToggle.classList.remove("filter-is-active");
    if (FilterMenu) FilterMenu.classList.remove("filter-is-active");
    site.classList.remove("filter-menu-open");
  });
}

if (FilterMenuToggle) {
  FilterMenuToggle.addEventListener("click", function(event) {
    FilterMenuToggle.classList.toggle("filter-is-active");
    if (FilterMenu) FilterMenu.classList.toggle("filter-is-active");
    site.classList.toggle("filter-menu-open");
    if (menuToggle) menuToggle.classList.remove("is-active");
    if (menu) menu.classList.remove("is-active");
    site.classList.remove("menu-open");
  });
}

if (FooterFilterMenuToggle) {
  FooterFilterMenuToggle.addEventListener("click", function(event) {
    if (FilterMenuToggle) FilterMenuToggle.classList.toggle("filter-is-active");
    if (FilterMenu) FilterMenu.classList.toggle("filter-is-active");
    site.classList.toggle("filter-menu-open");
  });
}

const topButton = document.querySelector('.top-trigger');

if (topButton) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      topButton.classList.toggle('top-button-active', !entry.isIntersecting);
    });
  });

  observer.observe(topButton);
}
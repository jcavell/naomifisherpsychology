const menuToggle = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");
const FilterMenuToggle = document.querySelector("#filter-menu-toggle");
const FooterFilterMenuToggle = document.querySelector("#footer-filter-menu-toggle");
const FilterMenu = document.querySelector("#filter-menu");
const site = document.querySelector("body");
	
menuToggle.addEventListener("click", function(event) {
    const menuOpen = menu.classList.contains("is-active");
    menuToggle.classList.toggle("is-active");
    menu.classList.toggle("is-active");
    site.classList.toggle("menu-open");
    FilterMenuToggle.classList.remove("filter-is-active");
    FilterMenu.classList.remove("filter-is-active");
    site.classList.remove("filter-menu-open");
});

FilterMenuToggle.addEventListener("click", function(event) {
    const FilterMenuOpen = menu.classList.contains("filter-is-active");
    FilterMenuToggle.classList.toggle("filter-is-active");
    FilterMenu.classList.toggle("filter-is-active");
    site.classList.toggle("filter-menu-open");
    menuToggle.classList.remove("is-active");
    menu.classList.remove("is-active");
    site.classList.remove("menu-open");
});

FooterFilterMenuToggle.addEventListener("click", function(event) {
    const FilterMenuOpen = menu.classList.contains("filter-is-active");
    FilterMenuToggle.classList.toggle("filter-is-active");
    FilterMenu.classList.toggle("filter-is-active");
    site.classList.toggle("filter-menu-open");
});

const topButton = document.querySelector('.top-trigger');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      topButton.classList.remove('top-button-active');
    }
    else {
        topButton.classList.add('top-button-active');
    }
  });
});

observer.observe(topButton);
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");

burger.addEventListener("click", () => {
    menu.classList.toggle("active");
});

const links = document.querySelectorAll(".menu a");

links.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });
});
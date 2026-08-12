const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");


burger.addEventListener("click", () => {
    menu.classList.toggle("active");
    burger.classList.toggle("open");
});


document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
        burger.classList.remove("open");
    });
});
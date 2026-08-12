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

document.addEventListener("click", (event) => {
    const clickInsideMenu = menu.contains(event.target);
    const clickOnBurger = burger.contains(event.target);

    if (
        menu.classList.contains("active") &&
        !clickInsideMenu &&
        !clickOnBurger
    ) {
        menu.classList.remove("active");
        burger.classList.remove("open");
    }
});
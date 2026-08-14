const products = [
    {
        id: 1,
        title: "Беспроводные наушники",
        category: "electronics",
        categoryName: "Электроника",
        price: 5990,
        description: "Компактные беспроводные наушники для музыки и звонков.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Смарт-часы",
        category: "electronics",
        categoryName: "Электроника",
        price: 8990,
        description: "Современные смарт-часы для повседневных задач и тренировок.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Худи",
        category: "clothing",
        categoryName: "Одежда",
        price: 3490,
        description: "Удобное базовое худи для повседневного образа.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Кроссовки",
        category: "clothing",
        categoryName: "Одежда",
        price: 7490,
        description: "Лёгкие повседневные кроссовки с современным дизайном.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Настольная лампа",
        category: "home",
        categoryName: "Для дома",
        price: 2790,
        description: "Минималистичная лампа для рабочего стола или спальни.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Кресло",
        category: "home",
        categoryName: "Для дома",
        price: 12990,
        description: "Комфортное кресло для отдыха в современном интерьере.",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
    }
];


const productsGrid = document.querySelector("#productsGrid");
const productsCount = document.querySelector("#productsCount");

const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const sortSelect = document.querySelector("#sortSelect");

const cartButton = document.querySelector("#cartButton");
const closeCart = document.querySelector("#closeCart");
const cart = document.querySelector("#cart");
const overlay = document.querySelector("#overlay");

const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");

const checkoutModal = document.querySelector("#checkoutModal");
const checkoutClose = document.querySelector("#checkoutClose");
const checkoutForm = document.querySelector("#checkoutForm");

const successMessage = document.querySelector("#successMessage");


let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];


function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₽";
}


function renderProducts(items) {

    productsGrid.innerHTML = "";

    productsCount.textContent = items.length;

    if (items.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                Товары не найдены
            </div>
        `;

        return;
    }

    items.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.title}"
            >

            <div class="product-content">

                <div class="product-category">
                    ${product.categoryName}
                </div>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-footer">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-id="${product.id}"
                    >
                        В корзину
                    </button>

                </div>

            </div>
        `;

        productsGrid.appendChild(card);
    });
}


function updateProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const selectedCategory = categoryFilter.value;
    const selectedSort = sortSelect.value;


    let filteredProducts = products.filter(product => {

        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    if (selectedSort === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }


    renderProducts(filteredProducts);
}


function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }


    const existingProduct = cartProducts.find(
        item => item.id === productId
    );


    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cartProducts.push({
            ...product,
            quantity: 1
        });
    }


    renderCart();
}


function removeFromCart(productId) {

    cartProducts = cartProducts.filter(
        item => item.id !== productId
    );

    renderCart();
}

function increaseQuantity(productId) {

    const product = cartProducts.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    product.quantity++;

    renderCart();
}


function decreaseQuantity(productId) {

    const product = cartProducts.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    product.quantity--;

    if (product.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}


function renderCart() {

    localStorage.setItem("cart", JSON.stringify(cartProducts));

    cartItems.innerHTML = "";


    if (cartProducts.length === 0) {

        cartItems.innerHTML = `
            <p class="cart-empty">
                Корзина пока пуста
            </p>
        `;
    }


    cartProducts.forEach(product => {

        const item = document.createElement("div");

        item.className = "cart-item";

       item.innerHTML = `
    <div class="cart-item-top">

        <div>
            <h3>${product.title}</h3>
            <p>${formatPrice(product.price)}</p>
        </div>

        <button
            class="remove-button"
            data-id="${product.id}"
        >
            Удалить
        </button>

    </div>

    <div class="quantity-controls">

        <button
            class="quantity-button decrease"
            data-id="${product.id}"
        >
            −
        </button>

        <span class="quantity">
            ${product.quantity}
        </span>

        <button
            class="quantity-button increase"
            data-id="${product.id}"
        >
            +
        </button>

    </div>
`;

        cartItems.appendChild(item);
    });


    const totalQuantity = cartProducts.reduce(
        (sum, product) => sum + product.quantity,
        0
    );


    const totalPrice = cartProducts.reduce(
        (sum, product) =>
            sum + product.price * product.quantity,
        0
    );


    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);
    checkoutButton.disabled = cartProducts.length === 0;
}


function openCart() {
    cart.classList.add("active");
    overlay.classList.add("active");
}


function closeCartPanel() {
    cart.classList.remove("active");
    overlay.classList.remove("active");
}

function openCheckout() {
    checkoutModal.classList.add("active");
    overlay.classList.add("active");
}

function closeCheckout() {
    checkoutModal.classList.remove("active");
    overlay.classList.remove("active");
}


searchInput.addEventListener("input", updateProducts);
categoryFilter.addEventListener("change", updateProducts);
sortSelect.addEventListener("change", updateProducts);


productsGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-button");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);

    addToCart(productId);
});


cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);

    if (button.classList.contains("increase")) {
        increaseQuantity(productId);
    }

    if (button.classList.contains("decrease")) {
        decreaseQuantity(productId);
    }

    if (button.classList.contains("remove-button")) {
        removeFromCart(productId);
    }
});


cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", () => {
    closeCartPanel();
    closeCheckout();
});

checkoutButton.addEventListener("click", () => {

    if (cartProducts.length === 0) {
        return;
    }

    closeCartPanel();
    openCheckout();
});

checkoutClose.addEventListener("click", closeCheckout);

checkoutForm.addEventListener("submit", event => {

    event.preventDefault();

    cartProducts = [];

    renderCart();

    checkoutForm.reset();

    closeCheckout();

    successMessage.classList.add("active");

setTimeout(() => {
    successMessage.classList.remove("active");
}, 3000);
});

renderProducts(products);
renderCart();

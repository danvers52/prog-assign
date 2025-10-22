let ItemsContainer;
let TotalElement;
let checkoutButton;
let CountElement;

    console.log("cart.js loaded")
    //cart logic
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];   
        } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            return [];
        }       
    }

    function saveCart(cart) {
        try {
            console.log("saveCart called");
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log("Cart saved:", cart);
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }

     //parameter {array} [currentCart] - the current cart array
    //otherwise it will fetch from localStorage
     function updateIconCount(currentCart) {
        const CountElement = document.getElementById("cartCount");
        if (!CountElement) return;
        const cart = currentCart || getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        CountElement.textContent = totalItems > 0 ? `${totalItems}` : "";
    }

    //parameter {string} messageText - displays a message
    //parameter {number} duration - is the duration a number appears for
    function showNotification(message) {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.warn("Notification element was not founded");
            return;
        }
        notification.textContent = message;
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    //parameter {string} id - the "product" ID
    //parameter {string} name - the "product" name
    //parameter {number} price - the "product" price
    function addToCart(id, name, price) {
        const numericPrice = parseFloat(price);
        let cart = getCart();
        const existingItem = cart.find(item => item.id == id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({id: 1, name: "Procastination!", price: numericPrice, quantity: 1});
        }

        saveCart(cart);
        updateIconCount(cart);
        displayCart();
        showNotification(`${name} added to cart!`);        
    }

    function removeItem(productId) {
        const cart = getCart();
        const normalizedId = parseInt(productId);
        const updatedCart = cart.filter(item => item.id !== normalizedId);
        saveCart(updatedCart);
        displayCart();
        updateIconCount(updatedCart);
    }

    //display the cart
    function displayCart() {
        const ItemsContainer = document.querySelector('.items-container');
        const TotalElement = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout');

        if (!ItemsContainer || !TotalElement || !checkoutButton) {
            console.error("Cart DOM elements not initialized.");
            return;
        }

        const cart = getCart();
        ItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            ItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            TotalElement.textContent = 'R 0.00';
            checkoutButton.disabled = true;
            updateIconCount(cart);
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const displayPrice = item.price === 0 ? "Free.99" : "R" + item.price.toFixed(2);
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.productId = item.id;

            cartItemDiv.innerHTML = `
            <strong>${item.name}</strong> - ${displayPrice} x ${item.quantity}
            <button class="increase-quantity-btn" data-product-id="${item.id}">+</button>
            <button class="decrease-quantity-btn" data-product-id="${item.id}">-</button>
            <button class="remove-item-btn" data-product-id="${item.id}">Remove</button>`;
            ItemsContainer.appendChild(cartItemDiv);
        });
        TotalElement.textContent = 'R ' + total.toFixed(2);
        checkoutButton.disabled = false;
        updateIconCount(cart)
    }

    //DOM initialization
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded");
        const cartBtns = document.querySelectorAll(".cartBtn");
        cartBtns.forEach(btn => {
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                const price = btn.dataset.price;
                addToCart(id, name, price);
            });
        });
        const ItemsContainer = document.querySelector('.items-container');
        if (ItemsContainer) {
            ItemsContainer.addEventListener("click", function (event) {
                const target = event.target;
                const productId = target.dataset.productId;
                if (!productId) return;

                if (target.classList.contains("remove-item-btn")) {
                    if (confirm("Do you want to remove this from your cart?")) {
                        removeItem(productId);
                    }
                }
                if (target.classList.contains("increase-quantity-btn")) {
                    updateQuantity(productId, 1);
                }
                if (target.classList.contains("decrease-quantity-btn")) {
                    updateQuantity(productId, -1);
                }
            });
        }
        displayCart();
    });

    //quantity update
    function updateQuantity(productId, change) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart(cart);
            displayCart();
            updateIconCount(cart);
        }
    }    

window.addToCart = addToCart;
window.updateIconCount = updateIconCount;
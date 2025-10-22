const originalItems = [
    {
        productId: "1",
        productName: "Procastination!",
        productPrice: "Free.99",
        quantity: 1
    }
];

const shoppingCart = originalItems.map(item => ({
    id: item.productId,
    name: item.productName,
    price: item.productPrice,
    quantity: item.quantity || 1
}));

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
    if (typeof window.updateIconCount === 'function') {
        window.updateIconCount([]);
    }
}
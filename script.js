// Stock functionality
let stock = {
    'Paket Ayam Geprek Hot Lava': 40,
    'Paket Ayam Geprek Sambal Matah': 40,
    'Ayam Geprek Only': 60,
    'Ayam Tanpa Sambal': 60,
    'Nasi Putih': 60,
    'Es Teh': 60,
    'Es Susu Coklat': 30
};

function updateStockDisplay() {
    const stockList = document.getElementById('stock-list');
    stockList.innerHTML = '';
    for (const [item, qty] of Object.entries(stock)) {
        const li = document.createElement('li');
        li.textContent = `${item}: ${qty} pcs`;
        stockList.appendChild(li);
    }
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
            <button onclick="removeFromCart(${index})">Hapus</button>
        `;
        cartItems.appendChild(itemDiv);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `Total: Rp ${total.toLocaleString()}`;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    updateCart();
    alert(`${name} ditambahkan ke keranjang!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Add to cart event listeners
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        addToCart(name, price);
    });
});

// Checkout
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    document.getElementById('payment-modal').style.display = 'block';
});

// Admin login modal
document.getElementById('admin-login-btn').addEventListener('click', function() {
    document.getElementById('admin-modal').style.display = 'block';
});

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Admin login form
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    if (username === 'admin' && password === 'admin') {
        document.getElementById('admin-modal').style.display = 'none';
        updateStockDisplay();
        document.getElementById('stock-modal').style.display = 'block';
    } else {
        alert('Username atau password salah!');
    }
});

// Payment form
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('payment-name').value;
    const amount = parseInt(document.getElementById('payment-amount').value);
    const whatsapp = '6283842325369';
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Send WhatsApp message with order details
    const message = `Halo, saya ${name} telah memesan:\n${cart.map(item => `${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}`).join('\n')}\nTotal: Rp ${total.toLocaleString()}\nJumlah Bayar: Rp ${amount.toLocaleString()}\nTerima kasih!`;
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Decrease stock
    cart.forEach(item => {
        if (stock[item.name]) {
            stock[item.name] -= item.quantity;
        }
    });
    updateStockDisplay();

    // Clear cart
    cart = [];
    updateCart();
    document.getElementById('payment-modal').style.display = 'none';
    this.reset();
});

// WhatsApp order button
document.getElementById('whatsapp-order-btn').addEventListener('click', function() {
    const whatsappNumber = '6283842325369';
    const message = 'Halo, saya ingin memesan ayam geprek!';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Initialize cart on load
updateCart();

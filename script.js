// تحميل السلة من التخزين المحلي
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// إضافة منتج للسلة
function addToCart(name, price) {

    const product = {
        id: Date.now(),
        name: name,
        price: price
    };

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("✅ تمت إضافة المنتج إلى السلة");
}

// حذف منتج من السلة
function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}

// عرض السلة
function renderCart() {

    const cartContainer =
        document.getElementById("cartItems");

    const totalContainer =
        document.getElementById("total");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML =
        "<p>السلة فارغة 🛒</p>";

        totalContainer.innerHTML = "";

        return;
    }

    cart.forEach(item => {

        total += item.price;

        cartContainer.innerHTML += `
        <div class="cart-item">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>

            <button
            onclick="removeFromCart(${item.id})">
            حذف
            </button>
        </div>
        `;
    });

    totalContainer.innerHTML =
    `الإجمالي: $${total.toFixed(2)}`;
}

// تفريغ السلة
function clearCart() {

    localStorage.removeItem("cart");

    cart = [];

    renderCart();

    alert("✅ تم تفريغ السلة");
}

// تنفيذ الطلب
function checkout() {

    if (cart.length === 0) {

        alert("السلة فارغة");

        return;
    }

    alert(
        "🎉 تم استلام طلبك بنجاح"
    );

    localStorage.removeItem("cart");

    cart = [];

    renderCart();
}

// تشغيل عرض السلة تلقائياً إذا كنا في cart.html
document.addEventListener(
    "DOMContentLoaded",
    function () {
        renderCart();
    }
);

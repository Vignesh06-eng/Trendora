const products = [
  {
    id: 1,
    name: 'Oversized Denim Jacket',
    category: 'women',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Classic Black Hoodie',
    category: 'men',
    price: 64.5,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Tailored Beige Blazer',
    category: 'women',
    price: 99.0,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Cargo Street Pants',
    category: 'men',
    price: 72.25,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Leather Crossbody Bag',
    category: 'accessories',
    price: 54.75,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    name: 'Gold Hoop Earrings',
    category: 'accessories',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    name: 'Relaxed Linen Shirt',
    category: 'men',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Pleated Midi Dress',
    category: 'women',
    price: 84.0,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80'
  }
];

const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMsg = document.getElementById('newsletter-msg');

let currentFilter = 'all';
let cart = [];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const byFilter = currentFilter === 'all' || product.category === currentFilter;
    const bySearch = product.name.toLowerCase().includes(query);
    return byFilter && bySearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="empty">No products found.</p>';
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span class="price">${formatPrice(product.price)}</span>
            <span class="category">${product.category}</span>
          </div>
          <button class="add-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join('');
}

function updateCartUI() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty">Your cart is empty.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>
          <div class="qty-controls">
            <button data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <button data-action="remove" data-id="${item.id}" aria-label="Remove item">🗑️</button>
      </article>
    `
    )
    .join('');
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return;
  }

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function updateQuantity(productId, action) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) {
    return;
  }

  if (action === 'increase') {
    item.quantity += 1;
  }

  if (action === 'decrease') {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((entry) => entry.id !== productId);
    }
  }

  if (action === 'remove') {
    cart = cart.filter((entry) => entry.id !== productId);
  }

  updateCartUI();
}

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener('input', renderProducts);

productGrid.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains('add-btn')) {
    const id = Number(target.dataset.id);
    addToCart(id);
    openCart();
  }
});

cartItemsContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  if (!action) {
    return;
  }

  const id = Number(target.dataset.id);
  updateQuantity(id, action);
});

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some items first.');
    return;
  }

  alert('Thanks for shopping at Trendora! Checkout flow is ready for backend integration.');
  cart = [];
  updateCartUI();
  closeCartDrawer();
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  newsletterMsg.textContent = 'Thanks for subscribing to Trendora!';
  newsletterForm.reset();
});

renderProducts();
updateCartUI();

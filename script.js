document.addEventListener('DOMContentLoaded', () => {
  const businessNumber = "923469160100";
  let cart = JSON.parse(localStorage.getItem('afyas_cart')) || [];

  const cartToggleBtn = document.getElementById('cart-toggle');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('whatsapp-checkout-btn');

  // Prevent XSS by escaping user-derived DOM text
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function saveAndRender() {
    localStorage.setItem('afyas_cart', JSON.stringify(cart));
    renderCart();
  }

  // Toggle expand / condense
  function toggleCart() {
    const isExpanded = cartDrawer.classList.contains('expanded');
    cartDrawer.classList.toggle('expanded', !isExpanded);
    cartDrawer.classList.toggle('condensed', isExpanded);
    cartDrawer.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  }

  cartToggleBtn.addEventListener('click', toggleCart);
  closeCartBtn.addEventListener('click', toggleCart);

  // Add Item to Cart
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card') || e.target.closest('article');
      if (!card) return;

      const name = card.querySelector('h3')?.innerText.trim() || "Product";
      const priceText = card.querySelector('.price-amount')?.innerText.trim() || "0";
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      
      const sizeInput = card.querySelector('input[type="radio"]:checked');
      const size = sizeInput ? sizeInput.value : null;

      const id = `${name}-${size || 'nosize'}`.toLowerCase().replace(/\s+/g, '-');

      const existingIndex = cart.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({ id, name, price, size, qty: 1 });
      }

      saveAndRender();
      if (cartDrawer.classList.contains('condensed')) {
        toggleCart();
      }
    });
  });

  // Render Cart UI
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
      checkoutBtn.disabled = true;
    } else {
      checkoutBtn.disabled = false;
      cart.forEach((item) => {
        totalItems += item.qty;
        totalPrice += item.price * item.qty;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-info">
            <strong>${sanitize(item.name)}</strong>
            <div><small>${item.size ? `Size: ${sanitize(item.size)} | ` : ''}Rs. ${item.price}</small></div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-id="${sanitize(item.id)}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="increase" data-id="${sanitize(item.id)}">+</button>
            <button class="remove-item-btn" data-action="remove" data-id="${sanitize(item.id)}">✕</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
    }

    cartCountEl.innerText = totalItems;
    cartTotalEl.innerText = `Rs. ${totalPrice}`;
  }

  // Handle Delegate Click Events inside Drawer
  cartItemsContainer.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (!action || !id) return;

    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    if (action === 'increase') {
      cart[itemIndex].qty += 1;
    } else if (action === 'decrease') {
      if (cart[itemIndex].qty > 1) {
        cart[itemIndex].qty -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
    } else if (action === 'remove') {
      cart.splice(itemIndex, 1);
    }

    saveAndRender();
  });

  // Clear Cart
  clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
    saveAndRender();
  });

  // WhatsApp Checkout Trigger
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let orderList = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
      const subtotal = item.price * item.qty;
      grandTotal += subtotal;
      orderList += `${index + 1}. *${item.name}*\n   Size: ${item.size || 'N/A'}\n   Qty: ${item.qty} x Rs. ${item.price} = Rs. ${subtotal}\n\n`;
    });

    const message = `Hello AFYAS Ventures! 👋\n\nI would like to place an order:\n\n${orderList}*Grand Total:* Rs. ${grandTotal}\n\nPlease let me know the availability and delivery details. Thanks!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${businessNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  });

  renderCart();
});
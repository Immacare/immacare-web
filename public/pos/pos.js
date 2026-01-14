// POS System JavaScript

// Global variables
let products = [];
let cart = [];
let categories = [];
let refreshInterval = null;

// Initialize POS
$(document).ready(function() {
  loadProducts();
  loadCategories();
  
  // Auto-refresh products every 30 seconds for real-time stock updates
  refreshInterval = setInterval(loadProducts, 30000);
});

// Load products from inventory
function loadProducts() {
  $.ajax({
    url: "/getInventory",
    method: "GET",
    success: function(response) {
      if (response.data) {
        products = response.data.map(item => ({
          id: item.id,
          name: item.item,
          category: item.category,
          categoryId: item.category_id,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.actual_stock) || 0,
          unit: item.unit || 'pc',
          status: item.status
        }));
        
        renderProducts();
        updateStockSummary();
      }
    },
    error: function() {
      showError("Failed to load products");
    }
  });
}

// Load categories
function loadCategories() {
  $.ajax({
    url: "/getInventoryCategories",
    method: "GET",
    success: function(response) {
      if (response.success && response.data) {
        categories = response.data;
        populateCategoryDropdown();
      }
    },
    error: function() {
      console.error("Failed to load categories");
    }
  });
}

// Populate category dropdown
function populateCategoryDropdown() {
  const dropdown = $("#categoryFilter");
  dropdown.empty();
  dropdown.append('<option value="all">All Categories</option>');
  
  categories.forEach(cat => {
    dropdown.append(`<option value="${cat.id}">${cat.category}</option>`);
  });
}

// Filter products based on search and filters
function filterProducts() {
  renderProducts();
}

// Render products grid
function renderProducts() {
  const grid = $("#productsGrid");
  const searchTerm = $("#productSearch").val().toLowerCase();
  const stockFilter = $("#stockFilter").val();
  const categoryFilter = $("#categoryFilter").val();
  
  let filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                          (product.category && product.category.toLowerCase().includes(searchTerm));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
                            product.categoryId === categoryFilter ||
                            product.category === categoryFilter;
    
    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = product.stock > 10;
    } else if (stockFilter === 'low') {
      matchesStock = product.stock > 0 && product.stock <= 10;
    } else if (stockFilter === 'out') {
      matchesStock = product.stock <= 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  if (filteredProducts.length === 0) {
    grid.html(`
      <div class="no-products">
        <i class="bi bi-inbox"></i>
        <p>No products found</p>
      </div>
    `);
    return;
  }
  
  grid.html(filteredProducts.map(product => {
    const stockStatus = getStockStatus(product.stock);
    const isOutOfStock = product.stock <= 0;
    
    return `
      <div class="product-card ${stockStatus.class} ${isOutOfStock ? 'out-of-stock' : ''}" 
           onclick="${isOutOfStock ? '' : `addToCart('${product.id}')`}"
           data-id="${product.id}">
        <span class="stock-badge ${stockStatus.badgeClass}">${stockStatus.label}</span>
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="product-category">${escapeHtml(product.category || 'Uncategorized')}</div>
        <div class="product-stock">
          <i class="bi bi-box"></i> ${product.stock} ${product.unit}
        </div>
        <div class="product-price">₱${formatNumber(product.price)}</div>
      </div>
    `;
  }).join(''));
}

// Get stock status
function getStockStatus(stock) {
  if (stock <= 0) {
    return { class: 'out-of-stock', badgeClass: 'out-of-stock', label: 'Out of Stock' };
  } else if (stock <= 10) {
    return { class: 'low-stock', badgeClass: 'low-stock', label: 'Low Stock' };
  }
  return { class: '', badgeClass: 'in-stock', label: 'In Stock' };
}

// Update stock summary
function updateStockSummary() {
  const total = products.length;
  const inStock = products.filter(p => p.stock > 10).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock <= 0).length;
  
  $("#totalItems").text(total);
  $("#inStockCount").text(inStock);
  $("#lowStockCount").text(lowStock);
  $("#outOfStockCount").text(outOfStock);
}

// Add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  if (product.stock <= 0) {
    showError("This item is out of stock");
    return;
  }
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showError(`Only ${product.stock} items available in stock`);
      return;
    }
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      maxStock: product.stock
    });
  }
  
  // Visual feedback
  $(`.product-card[data-id="${productId}"]`).addClass('added');
  setTimeout(() => {
    $(`.product-card[data-id="${productId}"]`).removeClass('added');
  }, 300);
  
  renderCart();
  updateCartTotals();
}

// Render cart
function renderCart() {
  const cartContainer = $("#cartItems");
  
  if (cart.length === 0) {
    cartContainer.html(`
      <div class="empty-cart">
        <i class="bi bi-cart-x"></i>
        <p>No items in cart</p>
        <small>Click on products to add them</small>
      </div>
    `);
    return;
  }
  
  cartContainer.html(cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">₱${formatNumber(item.price)} each</div>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateQuantity('${item.id}', -1)">
          <i class="bi bi-dash"></i>
        </button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.id}', 1)">
          <i class="bi bi-plus"></i>
        </button>
      </div>
      <div class="cart-item-total">₱${formatNumber(item.price * item.quantity)}</div>
      <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">
        <i class="bi bi-x-lg"></i>
      </div>
    </div>
  `).join(''));
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  
  const newQty = item.quantity + change;
  
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  
  if (newQty > item.maxStock) {
    showError(`Only ${item.maxStock} items available in stock`);
    return;
  }
  
  item.quantity = newQty;
  renderCart();
  updateCartTotals();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
  updateCartTotals();
}

// Clear cart
function clearCart() {
  if (cart.length === 0) return;
  
  Swal.fire({
    title: 'Clear Cart?',
    text: 'Are you sure you want to remove all items?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Yes, clear it'
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      renderCart();
      updateCartTotals();
      $("#amountPaid").val('');
      calculateChange();
    }
  });
}

// Update cart totals
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountPercent = parseFloat($("#discountPercent").val()) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal - discountAmount;
  
  $("#subtotal").text(`₱${formatNumber(subtotal)}`);
  $("#discountAmount").text(`-₱${formatNumber(discountAmount)}`);
  $("#grandTotal").text(`₱${formatNumber(grandTotal)}`);
  
  calculateChange();
}

// Calculate change
function calculateChange() {
  const grandTotal = parseFloat($("#grandTotal").text().replace(/[₱,]/g, '')) || 0;
  const amountPaid = parseFloat($("#amountPaid").val()) || 0;
  const change = amountPaid - grandTotal;
  
  const changeDisplay = $("#changeAmount");
  changeDisplay.text(`₱${formatNumber(Math.abs(change))}`);
  
  if (change < 0) {
    changeDisplay.addClass('negative').removeClass('text-success');
    changeDisplay.text(`-₱${formatNumber(Math.abs(change))}`);
  } else {
    changeDisplay.removeClass('negative').addClass('text-success');
  }
}

// Process payment
function processPayment() {
  if (cart.length === 0) {
    showError("Cart is empty");
    return;
  }
  
  const grandTotal = parseFloat($("#grandTotal").text().replace(/[₱,]/g, '')) || 0;
  const amountPaid = parseFloat($("#amountPaid").val()) || 0;
  
  if (amountPaid < grandTotal) {
    showError("Insufficient payment amount");
    return;
  }
  
  // Generate receipt
  const receiptData = {
    transactionId: generateTransactionId(),
    date: new Date().toLocaleString(),
    items: [...cart],
    subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    discountPercent: parseFloat($("#discountPercent").val()) || 0,
    grandTotal: grandTotal,
    amountPaid: amountPaid,
    change: amountPaid - grandTotal
  };
  
  // Update inventory stock (send to server)
  updateInventoryStock(cart);
  
  // Show receipt
  showReceipt(receiptData);
  
  // Clear cart
  cart = [];
  renderCart();
  updateCartTotals();
  $("#amountPaid").val('');
  $("#discountPercent").val(0);
  calculateChange();
  
  // Refresh products to show updated stock
  setTimeout(loadProducts, 1000);
}

// Update inventory stock after sale
function updateInventoryStock(soldItems) {
  soldItems.forEach(item => {
    $.ajax({
      url: "/pos/updateStock",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        itemId: item.id,
        quantitySold: item.quantity
      }),
      error: function() {
        console.error("Failed to update stock for item:", item.id);
      }
    });
  });
}

// Generate transaction ID
function generateTransactionId() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN-${dateStr}-${random}`;
}

// Show receipt
function showReceipt(data) {
  const discountAmount = data.subtotal * (data.discountPercent / 100);
  
  const receiptHtml = `
    <div class="receipt-header">
      <h3>IMMACARE CLINIC</h3>
      <p>Point of Sale Receipt</p>
      <small>${data.date}</small><br>
      <small>Transaction: ${data.transactionId}</small>
    </div>
    <div class="receipt-items">
      ${data.items.map(item => `
        <div class="receipt-item">
          <span>${item.name} x${item.quantity}</span>
          <span>₱${formatNumber(item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>
    <div class="receipt-totals">
      <div class="receipt-total-row">
        <span>Subtotal:</span>
        <span>₱${formatNumber(data.subtotal)}</span>
      </div>
      ${data.discountPercent > 0 ? `
        <div class="receipt-total-row">
          <span>Discount (${data.discountPercent}%):</span>
          <span>-₱${formatNumber(discountAmount)}</span>
        </div>
      ` : ''}
      <div class="receipt-total-row grand-total">
        <span>TOTAL:</span>
        <span>₱${formatNumber(data.grandTotal)}</span>
      </div>
      <div class="receipt-total-row">
        <span>Amount Paid:</span>
        <span>₱${formatNumber(data.amountPaid)}</span>
      </div>
      <div class="receipt-total-row">
        <span>Change:</span>
        <span>₱${formatNumber(data.change)}</span>
      </div>
    </div>
    <div class="receipt-footer">
      <p>Thank you for your purchase!</p>
      <small>ImmaCare+ Clinic</small>
    </div>
  `;
  
  $("#receiptContent").html(receiptHtml);
  
  const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
  modal.show();
}

// Print receipt
function printReceipt() {
  const receiptContent = document.getElementById('receiptContent').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; max-width: 300px; margin: 0 auto; }
        .receipt-header { text-align: center; border-bottom: 1px dashed #333; padding-bottom: 10px; margin-bottom: 10px; }
        .receipt-header h3 { margin: 0; font-size: 16px; }
        .receipt-items { margin: 15px 0; }
        .receipt-item { display: flex; justify-content: space-between; margin: 5px 0; }
        .receipt-totals { border-top: 1px dashed #333; padding-top: 10px; margin-top: 10px; }
        .receipt-total-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .receipt-total-row.grand-total { font-weight: bold; font-size: 14px; border-top: 1px solid #333; padding-top: 5px; margin-top: 5px; }
        .receipt-footer { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #333; }
      </style>
    </head>
    <body>
      ${receiptContent}
      <script>window.onload = function() { window.print(); window.close(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Helper functions
function formatNumber(num) {
  return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    timer: 2000,
    showConfirmButton: false
  });
}

// Cleanup on page unload
$(window).on('beforeunload', function() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

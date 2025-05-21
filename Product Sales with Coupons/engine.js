let products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = null;
let total = 0;
let discountAmount = 0;

const coupons = {
  "SAVE10": 10,   // 10% discount
  "FLAT50": 50,   // Flat ₹50 off
  "WELCOME": 20   // 20% discount
};

function renderProducts() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  total = 0;

  products.forEach((product, index) => {
    const row = productList.insertRow();
    row.insertCell(0).textContent = product.name;
    row.insertCell(1).textContent = `₹${product.price.toFixed(2)}`;
    const actions = row.insertCell(2);
    actions.innerHTML = `
      <button class="action-btn" onclick="editProduct(${index})">Edit</button>
      <button class="action-btn" onclick="deleteProduct(${index})">Delete</button>
    `;
    total += product.price;
  });

  document.getElementById('total').textContent = `Total: ₹${total.toFixed(2)}`;
  document.getElementById('discountedTotal').textContent = '';

  if (products.length === 0) {
    document.getElementById('total').textContent = "Total: ₹0";
    document.getElementById('discountedTotal').textContent = '';
  }

  localStorage.setItem('products', JSON.stringify(products));
}

function addOrUpdateProduct() {
  const name = document.getElementById('productName').value;
  const price = parseFloat(document.getElementById('productPrice').value);

  if (!name.trim() || isNaN(price) || price <= 0) {
    alert("Please enter a valid product name and price.");
    return;
  }

  if (editIndex !== null) {
    products[editIndex] = { name, price };
    editIndex = null;
  } else {
    products.push({ name, price });
  }

  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  renderProducts();
}

function editProduct(index) {
  const product = products[index];
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  editIndex = index;
}

function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    renderProducts();
  }
}

function applyCoupon() {
  const code = document.getElementById('couponCode').value.trim().toUpperCase();
  discountAmount = 0;

  if (!coupons[code]) {
    alert("Invalid coupon code.");
    return;
  }

  const value = coupons[code];
  if (code === "FLAT50") {
    discountAmount = Math.min(value, total); // Flat ₹50
  } else {
    discountAmount = total * (value / 100);  // Percentage
  }

  const finalTotal = total - discountAmount;
  document.getElementById('discountedTotal').textContent = 
    `After Discount (${code}): ₹${finalTotal.toFixed(2)} (You saved ₹${discountAmount.toFixed(2)})`;
}

renderProducts();

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const currencySelect = document.getElementById("currency-select");

  // --- Elementos de la sección de costos ---
  const envioInputs = document.querySelectorAll('input[name="envio"]');
  const subtotalDisplay = document.getElementById("subtotalDisplay");
  const envioDisplay = document.getElementById("envioDisplay");
  const totalDisplay = document.getElementById("totalDisplay");

  // Tasas de conversión (ajustá según necesites)
  const conversionRates = { USD: 1, UYU: 40 }; // 1 USD = 40 UYU
  let currentCurrency = localStorage.getItem("selectedCurrency") || "USD";

  // Porcentaje de envío seleccionado
  let porcentajeEnvio = 0;

  // Establecer moneda actual en el selector
  if (currencySelect) currencySelect.value = currentCurrency;

  // Si el carrito está vacío
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="alert alert-info mt-3" role="alert">
        Tu carrito está vacío 🛒
      </div>`;
    subtotalElement.textContent = "Subtotal: USD 0";
    totalElement.textContent = "Total: USD 0";
    subtotalDisplay.textContent = "Subtotal: USD 0";
    envioDisplay.textContent = "Costo de envío: USD 0";
    totalDisplay.textContent = "Total: USD 0";
    return;
  }

  // --- Función de conversión ---
  function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    // Convertir primero a USD, luego a la moneda destino
    return (amount / conversionRates[from]) * conversionRates[to];
  }

  // --- Renderizar carrito ---
  function renderCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((producto, index) => {
      const priceConverted = convertCurrency(producto.unitCost, producto.currency, currentCurrency);
      const itemSubtotal = priceConverted * producto.count;
      subtotal += itemSubtotal;

      const item = document.createElement("div");
      item.classList.add("cart-item", "border", "rounded", "p-3", "mb-3", "d-flex", "justify-content-between", "align-items-center");

      item.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${producto.image}" alt="${producto.name}" class="me-3" style="width: 100px; height: 100px; object-fit: cover;">
          <div>
            <h5 class="mb-1">${producto.name}</h5>
            <p class="mb-1 text-muted">${currentCurrency} ${priceConverted.toFixed(2)}</p>
            <button class="btn btn-sm btn-outline-danger eliminar-btn" data-index="${index}">
              <i class="fa fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
        <div class="text-end">
          <input type="number" min="1" value="${producto.count}" class="form-control cantidad-input mb-2" data-index="${index}" style="width: 80px;">
          <p class="mb-0 fw-bold item-subtotal">${currentCurrency} ${itemSubtotal.toFixed(2)}</p>
        </div>
      `;
      cartContainer.appendChild(item);
    });

    subtotalElement.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(2)}`;
    totalElement.textContent = `Total: ${currentCurrency} ${subtotal.toFixed(2)}`;

    // Actualiza también la sección de costos
    actualizarCostos();

    addEventListeners();
  }

  // --- Función para actualizar los costos (subtotal + envío + total) ---
  function actualizarCostos() {
    let subtotal = 0;

    cart.forEach(producto => {
      const priceConverted = convertCurrency(producto.unitCost, producto.currency, currentCurrency);
      subtotal += priceConverted * producto.count;
    });

    const costoEnvio = (subtotal * porcentajeEnvio) / 100;
    const total = subtotal + costoEnvio;

    subtotalDisplay.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(2)}`;
    envioDisplay.textContent = `Costo de envío (${porcentajeEnvio}%): ${currentCurrency} ${costoEnvio.toFixed(2)}`;
    totalDisplay.textContent = `Total: ${currentCurrency} ${total.toFixed(2)}`;
  }

  // --- Eventos ---
  function addEventListeners() {
    // Cambiar cantidad
    document.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("input", e => {
        const index = e.target.dataset.index;
        const nuevaCantidad = parseInt(e.target.value);
        if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;

        cart[index].count = nuevaCantidad;
        localStorage.setItem("cart", JSON.stringify(cart));
        actualizarTotales();
      });
    });

    // Eliminar producto
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.closest("button").dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      });
    });
  }

  // --- Actualizar totales (cuando cambian cantidades) ---
  function actualizarTotales() {
    let nuevoSubtotal = 0;

    document.querySelectorAll(".cart-item").forEach((item, i) => {
      const producto = cart[i];
      const priceConverted = convertCurrency(producto.unitCost, producto.currency, currentCurrency);
      const itemSubtotal = producto.count * priceConverted;

      item.querySelector(".item-subtotal").textContent = `${currentCurrency} ${itemSubtotal.toFixed(2)}`;
      nuevoSubtotal += itemSubtotal;
    });

    subtotalElement.textContent = `Subtotal: ${currentCurrency} ${nuevoSubtotal.toFixed(2)}`;
    totalElement.textContent = `Total: ${currentCurrency} ${nuevoSubtotal.toFixed(2)}`;

    // Recalcular sección de costos con el nuevo subtotal
    actualizarCostos();
  }

  // --- Cambio de tipo de envío ---
  envioInputs.forEach(input => {
    input.addEventListener("change", e => {
      porcentajeEnvio = parseFloat(e.target.dataset.percent);
      actualizarCostos();
    });
  });

  // --- Cambio de moneda ---
  if (currencySelect) {
    currencySelect.addEventListener("change", e => {
      currentCurrency = e.target.value;
      localStorage.setItem("selectedCurrency", currentCurrency);
      renderCart();
    });
  }

  // --- Actualizar badge del carrito ---
  function actualizarBadgeCarrito() {
    const total = cart.reduce((acc, prod) => acc + (prod.count || 0), 0);
    const badge = document.getElementById("cart-count");
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? "inline" : "none";
    }
  }

  // Inicialización
  renderCart();
  actualizarBadgeCarrito();
});

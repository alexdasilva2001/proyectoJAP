document.addEventListener("DOMContentLoaded", function () {
  // ================== CARRITO ==================
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const currencySelect = document.getElementById("currency-select");

  const envioInputs = document.querySelectorAll('input[name="envio"]');
  const subtotalDisplay = document.getElementById("subtotalDisplay");
  const envioDisplay = document.getElementById("envioDisplay");
  const totalDisplay = document.getElementById("totalDisplay");

  const conversionRates = { USD: 1, UYU: 40 };
  let currentCurrency = localStorage.getItem("selectedCurrency") || "USD";
  let porcentajeEnvio = 0;

  if (currencySelect) currencySelect.value = currentCurrency;

  // Badge carrito navbar
  function actualizarBadgeCarrito() {
    const total = cart.reduce((acc, prod) => acc + (prod.count || 0), 0);
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline" : "none";
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="alert alert-info mt-3" role="alert">
        Tu carrito está vacío 🛒
      </div>`;
    actualizarCostos();
    actualizarBadgeCarrito();
  } else {
    renderCart();
  }

  actualizarBadgeCarrito();

  // Conversión de moneda
  function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    return (amount / conversionRates[from]) * conversionRates[to];
  }

  // Render del carrito
  function renderCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((producto, idx) => {
      const priceConverted = convertCurrency(
        producto.unitCost,
        producto.currency,
        currentCurrency
      );

      const itemSubtotal = priceConverted * producto.count;
      subtotal += itemSubtotal;

      const item = document.createElement("div");
      item.classList.add(
        "cart-item",
        "border", "rounded",
        "p-3", "mb-3",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      item.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${producto.image}" width="100" height="100" class="me-3" style="object-fit:cover;">
          <div>
            <h5 class="mb-1">${producto.name}</h5>
            <p class="mb-1 text-muted">${currentCurrency} ${priceConverted.toFixed(2)}</p>
            <button class="btn btn-sm btn-outline-danger eliminar-btn" data-index="${idx}">
              <i class="fa fa-trash"></i> Eliminar
            </button>
          </div>
        </div>

        <div class="text-end">
          <input 
            type="number" min="1" 
            class="form-control cantidad-input mb-2"
            data-index="${idx}" 
            value="${producto.count}"
            style="width: 80px;">
          <p class="mb-0 fw-bold item-subtotal">${currentCurrency} ${itemSubtotal.toFixed(2)}</p>
        </div>
      `;

      cartContainer.appendChild(item);
    });

    subtotalElement.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(2)}`;
    totalElement.textContent = `Total: ${currentCurrency} ${subtotal.toFixed(2)}`;

    addCartEventListeners();
    actualizarCostos();
  }

  // ================== ACTUALIZAR COSTOS ==================
  function actualizarCostos() {
    let subtotal = 0;

    cart.forEach((p) => {
      subtotal += convertCurrency(p.unitCost, p.currency, currentCurrency) * p.count;
    });

    const envio = (subtotal * porcentajeEnvio) / 100;
    const total = subtotal + envio;

    if (subtotalDisplay) subtotalDisplay.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(2)}`;
    if (envioDisplay) envioDisplay.textContent = `Costo de envío (${porcentajeEnvio}%): ${currentCurrency} ${envio.toFixed(2)}`;
    if (totalDisplay) totalDisplay.textContent = `Total: ${currentCurrency} ${total.toFixed(2)}`;
  }

  // ================== EVENTOS EN CARRITO ==================
  function addCartEventListeners() {
    // Cambiar cantidad
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        const nuevaCantidad = parseInt(e.target.value);
        if (!isFinite(nuevaCantidad) || nuevaCantidad < 1) return;

        cart[index].count = nuevaCantidad;
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
      });
    });

    // Eliminar
    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.closest("button").dataset.index;
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
        actualizarBadgeCarrito();
      });
    });
  }

  // Cambio de moneda
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem("selectedCurrency", currentCurrency);
      renderCart();
    });
  }

  // Envío
  envioInputs.forEach((inp) => {
    inp.addEventListener("change", (e) => {
      porcentajeEnvio = parseFloat(e.target.dataset.percent);
      actualizarCostos();
    });
  });

  // ================= VALIDACIONES ==================
  function marcarInvalido(input, msg) {
    input.classList.add("is-invalid");
    let fb = input.parentElement.querySelector(".invalid-feedback");
    if (!fb) {
      fb = document.createElement("div");
      fb.className = "invalid-feedback";
      input.parentElement.appendChild(fb);
    }
    fb.textContent = msg;
    return false;
  }

  function limpiarInvalido(input) {
    input.classList.remove("is-invalid");
    const fb = input.parentElement.querySelector(".invalid-feedback");
    if (fb) fb.textContent = "";
  }

  function desplazarAlPrimerError() {
    const el = document.querySelector(".is-invalid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function validarDireccion() {
    const calle = document.getElementById("calle");
    const numero = document.getElementById("numero");
    const esquina = document.getElementById("esquina");

    let ok = true;
    [calle, numero, esquina].forEach(limpiarInvalido);

    if (!calle.value.trim()) ok = marcarInvalido(calle, "Ingresá la calle.");
    if (!numero.value.trim()) ok = marcarInvalido(numero, "Ingresá el número.");
    if (!esquina.value.trim()) ok = marcarInvalido(esquina, "Ingresá la esquina.");

    return ok;
  }

  function validarEnvio() {
    const group = document.getElementById("grupo-envio");
    const radios = Array.from(envioInputs);
    const valido = radios.some(r => r.checked);

    group.classList.remove("is-invalid");
    const fb = group.querySelector(".invalid-feedback");

    if (!valido) {
      group.classList.add("is-invalid");
      if (fb) fb.textContent = "Seleccioná una forma de envío.";
    }

    return valido;
  }

  function validarCantidades() {
    let ok = true;
    document.querySelectorAll(".cantidad-input").forEach((inp) => {
      limpiarInvalido(inp);
      if (!inp.value || inp.value <= 0) ok = marcarInvalido(inp, "La cantidad debe ser mayor a 0.");
    });
    return ok;
  }

  function validarPago() {
    const radios = document.querySelectorAll('input[name="pago"]');
    const group = document.getElementById("grupo-pago");
    const seleccionado = Array.from(radios).some(r => r.checked);

    group.classList.remove("is-invalid");
    const fb = group.querySelector(".invalid-feedback");

    if (!seleccionado) {
      group.classList.add("is-invalid");
      if (fb) fb.textContent = "Seleccioná una forma de pago.";
    }
    return seleccionado;
  }

  // ================== SWEETALERT & FETCH ==================
  function mostrarExito(msg) {
    Swal.fire({
      title: "¡Compra exitosa!",
      text: msg,
      icon: "success",
      iconColor: "#6affd6",
      background: "#2a0055",
      color: "#fff",
      confirmButtonColor: "#8a2be2"
    });
  }

  async function finalizarCompra(e) {
    e.preventDefault();

    const ok =
      validarDireccion() &&
      validarEnvio() &&
      validarCantidades() &&
      validarPago();

    if (!ok) {
      desplazarAlPrimerError();
      return;
    }

    // Preparar los items para enviar al backend
    const items = cart.map(p => ({
      product_id: p.id, // ajusta si tu producto tiene otro campo
      quantity: p.count
    }));

    try {
      const response = await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      });

      const data = await response.json();

      if (data.ok) {
        mostrarExito(`Tu pedido fue procesado correctamente. ID de carrito: ${data.cartId}`);
        localStorage.removeItem("cart"); // limpiar carrito
        renderCart();
        actualizarBadgeCarrito();
      } else {
        Swal.fire("Error", "No se pudo procesar tu compra", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  }

  const btn = document.getElementById("finalizarCompraBtn");
  if (btn) btn.addEventListener("click", finalizarCompra);
});
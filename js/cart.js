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

  function actualizarBadgeCarrito() {
    const total = cart.reduce((acc, prod) => acc + (prod.count || 0), 0);
    const badge = document.getElementById("cart-count");
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? "inline" : "none";
    }
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="alert alert-info mt-3" role="alert">
        Tu carrito está vacío 🛒
      </div>`;
    if (subtotalElement) subtotalElement.textContent = "Subtotal: USD 0";
    if (totalElement) totalElement.textContent = "Total: USD 0";
    if (subtotalDisplay) subtotalDisplay.textContent = "Subtotal: USD 0";
    if (envioDisplay) envioDisplay.textContent = "Costo de envío: USD 0";
    if (totalDisplay) totalDisplay.textContent = "Total: USD 0";
    actualizarBadgeCarrito();
  } else {
    renderCart();
    actualizarBadgeCarrito();
  }

  function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    return (amount / conversionRates[from]) * conversionRates[to];
  }

  function renderCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((producto, index) => {
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
        "border",
        "rounded",
        "p-3",
        "mb-3",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      item.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${producto.image}" alt="${producto.name}" class="me-3" style="width: 100px; height: 100px; object-fit: cover;">
          <div>
            <h5 class="mb-1">${producto.name}</h5>
            <p class="mb-1 text-muted">${currentCurrency} ${priceConverted.toFixed(
        2
      )}</p>
            <button class="btn btn-sm btn-outline-danger eliminar-btn" data-index="${index}">
              <i class="fa fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
        <div class="text-end">
          <input type="number" min="1" value="${producto.count}"
                 class="form-control cantidad-input mb-2"
                 data-index="${index}" style="width: 80px;">
          <p class="mb-0 fw-bold item-subtotal">${currentCurrency} ${itemSubtotal.toFixed(
        2
      )}</p>
        </div>
      `;

      cartContainer.appendChild(item);
    });

    if (subtotalElement) {
      subtotalElement.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(
        2
      )}`;
    }
    if (totalElement) {
      totalElement.textContent = `Total: ${currentCurrency} ${subtotal.toFixed(
        2
      )}`;
    }

    actualizarCostos();
    addCartEventListeners();
  }

  function actualizarCostos() {
    let subtotal = 0;

    cart.forEach((producto) => {
      const priceConverted = convertCurrency(
        producto.unitCost,
        producto.currency,
        currentCurrency
      );
      subtotal += priceConverted * producto.count;
    });

    const costoEnvio = (subtotal * porcentajeEnvio) / 100;
    const total = subtotal + costoEnvio;

    if (subtotalDisplay) {
      subtotalDisplay.textContent = `Subtotal: ${currentCurrency} ${subtotal.toFixed(
        2
      )}`;
    }
    if (envioDisplay) {
      envioDisplay.textContent = `Costo de envío (${porcentajeEnvio}%): ${currentCurrency} ${costoEnvio.toFixed(
        2
      )}`;
    }
    if (totalDisplay) {
      totalDisplay.textContent = `Total: ${currentCurrency} ${total.toFixed(2)}`;
    }
  }

  function addCartEventListeners() {
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        const nuevaCantidad = parseInt(e.target.value);
        if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;

        cart[index].count = nuevaCantidad;
        localStorage.setItem("cart", JSON.stringify(cart));
        actualizarTotales();
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        const index = button.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      });
    });
  }

  function actualizarTotales() {
    let nuevoSubtotal = 0;

    document.querySelectorAll(".cart-item").forEach((item, i) => {
      const producto = cart[i];
      const priceConverted = convertCurrency(
        producto.unitCost,
        producto.currency,
        currentCurrency
      );
      const itemSubtotal = producto.count * priceConverted;

      const subEl = item.querySelector(".item-subtotal");
      if (subEl) {
        subEl.textContent = `${currentCurrency} ${itemSubtotal.toFixed(2)}`;
      }
      nuevoSubtotal += itemSubtotal;
    });

    if (subtotalElement) {
      subtotalElement.textContent = `Subtotal: ${currentCurrency} ${nuevoSubtotal.toFixed(
        2
      )}`;
    }
    if (totalElement) {
      totalElement.textContent = `Total: ${currentCurrency} ${nuevoSubtotal.toFixed(
        2
      )}`;
    }

    actualizarCostos();
  }

  envioInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      porcentajeEnvio = parseFloat(e.target.dataset.percent);
      actualizarCostos();
    });
  });

  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem("selectedCurrency", currentCurrency);
      if (cart.length > 0) renderCart();
      actualizarCostos();
    });
  }

  // ================== VALIDACIONES CHECKOUT ==================

  function marcarInvalido(input, mensaje) {
    if (!input) return false;
    input.classList.add("is-invalid");

    let fb =
      input.parentElement &&
      input.parentElement.querySelector(".invalid-feedback");
    if (!fb) {
      fb = document.createElement("div");
      fb.className = "invalid-feedback";
      if (input.parentElement) {
        input.parentElement.appendChild(fb);
      }
    }
    fb.textContent = mensaje;
    return false;
  }

  function limpiarInvalido(input) {
    if (!input) return;
    input.classList.remove("is-invalid");
    const fb =
      input.parentElement &&
      input.parentElement.querySelector(".invalid-feedback");
    if (fb) fb.textContent = "";
  }

  function desplazarAlPrimerError() {
    const primero = document.querySelector(".is-invalid");
    if (primero)
      primero.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function validarDireccion() {
    const calle = document.getElementById("calle");
    const numero = document.getElementById("numero");
    const esquina = document.getElementById("esquina");

    let ok = true;

    limpiarInvalido(calle);
    limpiarInvalido(numero);
    limpiarInvalido(esquina);

    if (!calle || !calle.value.trim())
      ok = marcarInvalido(calle, "Ingresá la calle.");
    if (!numero || !numero.value.trim())
      ok = marcarInvalido(numero, "Ingresá el número.");
    if (!esquina || !esquina.value.trim())
      ok = marcarInvalido(esquina, "Ingresá la esquina.");

    return !!ok;
  }

  function validarEnvio() {
    const radiosEnvio = document.querySelectorAll('input[name="envio"]');
    let algunoMarcado = false;
    for (let i = 0; i < radiosEnvio.length; i++) {
      if (radiosEnvio[i].checked) {
        algunoMarcado = true;
        break;
      }
    }
    const contenedor = document.getElementById("grupo-envio");
    if (contenedor) {
      contenedor.classList.remove("is-invalid");
      let fb = contenedor.querySelector(".invalid-feedback");
      if (fb) fb.textContent = "";
      if (!algunoMarcado) {
        contenedor.classList.add("is-invalid");
        if (!fb) {
          fb = document.createElement("div");
          fb.className = "invalid-feedback";
          contenedor.appendChild(fb);
        }
        fb.textContent = "Seleccioná una forma de envío.";
      }
    }
    return algunoMarcado;
  }

  function validarCantidades() {
    const cantidades = document.querySelectorAll(
      'input.cantidad-input[type="number"]'
    );
    if (!cantidades.length) return true; // si no hay productos, no marca error

    let ok = true;
    cantidades.forEach((inp) => {
      limpiarInvalido(inp);
      const valor = Number(inp.value);
      if (!isFinite(valor) || valor <= 0) {
        ok = marcarInvalido(inp, "La cantidad debe ser mayor a 0.");
      }
    });
    return ok;
  }

  function validarPago() {
    const radiosPago = document.querySelectorAll('input[name="pago"]');
    let metodo = null;
    for (let i = 0; i < radiosPago.length; i++) {
      if (radiosPago[i].checked) {
        metodo = radiosPago[i].value;
        break;
      }
    }

    const contenedor = document.getElementById("grupo-pago");
    if (contenedor) {
      contenedor.classList.remove("is-invalid");
      let fb = contenedor.querySelector(".invalid-feedback");
      if (fb) fb.textContent = "";
      if (!metodo) {
        contenedor.classList.add("is-invalid");
        if (!fb) {
          fb = document.createElement("div");
          fb.className = "invalid-feedback";
          contenedor.appendChild(fb);
        }
        fb.textContent = "Seleccioná una forma de pago.";
        return false;
      }
    } else if (!metodo) {
      return false;
    }

    return true;
  }

function mostrarExito(mensaje) {
  Swal.fire({
    title: "¡Compra exitosa!",
    text: mensaje,
    icon: "success",
    iconColor: "#6affd6", 
    background: "#2a0055",
    color: "#ffffff",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#8a2be2",
    customClass: {
      popup: "swal-popup-purple",
      title: "swal-title-purple",
      htmlContainer: "swal-text-purple",
      confirmButton: "swal-button-purple"
    }
  });
}



  function finalizarCompra(evento) {
    if (evento && evento.preventDefault) evento.preventDefault();

    const okDireccion = validarDireccion();
    const okEnvio = validarEnvio();
    const okCant = validarCantidades();
    const okPago = validarPago();

    if (okDireccion && okEnvio && okCant && okPago) {
      mostrarExito("Tu pedido fue procesado correctamente.");
    } else {
      desplazarAlPrimerError();
    }
  }

  const botonFinalizar = document.getElementById("finalizarCompraBtn");
  if (botonFinalizar) {
    botonFinalizar.addEventListener("click", finalizarCompra);
  }
});

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

function limpiarInvalido(input) {
  if (!input) return;
  input.classList.remove('is-invalid');
  var fb = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
  if (fb) fb.textContent = '';
}

function desplazarAlPrimerError() {
  var primero = document.querySelector('.is-invalid');
  if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function validarDireccion() {
  var calle   = document.getElementById('calle');
  var numero  = document.getElementById('numero');
  var esquina = document.getElementById('esquina');
  var ok = true;

  limpiarInvalido(calle);
  limpiarInvalido(numero);
  limpiarInvalido(esquina);

  if (!calle || !calle.value.trim())   ok = marcarInvalido(calle, 'Ingresá la calle.');
  if (!numero || !numero.value.trim()) ok = marcarInvalido(numero, 'Ingresá el número.');
  if (!esquina || !esquina.value.trim()) ok = marcarInvalido(esquina, 'Ingresá la esquina.');

  return !!ok;
}

function validarEnvio() {
  var radiosEnvio = document.querySelectorAll('input[name="envio"]');
  var algunoMarcado = false;
  for (var i = 0; i < radiosEnvio.length; i++) {
    if (radiosEnvio[i].checked) {
      algunoMarcado = true;
      break;
    }
  }
  var contenedor = document.getElementById('grupo-envio');
  if (contenedor) {
    contenedor.classList.remove('is-invalid');
    var fb = contenedor.querySelector('.invalid-feedback');
    if (fb) fb.textContent = '';
    if (!algunoMarcado) {
      contenedor.classList.add('is-invalid');
      if (!fb) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        contenedor.appendChild(fb);
      }
      fb.textContent = 'Seleccioná una forma de envío.';
    }
  }
  return algunoMarcado;
}

function validarCantidades() {
  var cantidades = document.querySelectorAll('input.item-qty[type="number"], input[name="cantidad"][type="number"]');
  var ok = true;
  for (var i = 0; i < cantidades.length; i++) {
    var inp = cantidades[i];
    limpiarInvalido(inp);
    var valor = Number(inp.value);
    if (!isFinite(valor) || valor <= 0) {
      ok = marcarInvalido(inp, 'La cantidad debe ser mayor a 0.');
    }
  }
  return ok;
}

function validarPago() {
  var radiosPago = document.querySelectorAll('input[name="pago"]');
  var metodo = null;
  for (var i = 0; i < radiosPago.length; i++) {
    if (radiosPago[i].checked) {
      metodo = radiosPago[i].value;
      break;
    }
  }
  var contenedor = document.getElementById('grupo-pago');
  if (contenedor) {
    contenedor.classList.remove('is-invalid');
    var fb = contenedor.querySelector('.invalid-feedback');
    if (fb) fb.textContent = '';
    if (!metodo) {
      contenedor.classList.add('is-invalid');
      if (!fb) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        contenedor.appendChild(fb);
      }
      fb.textContent = 'Seleccioná una forma de pago.';
      return false;
    }
  } else if (!metodo) {
    return false;
  }

  var tarjetaNumero      = document.getElementById('tarjetaNumero');
  var tarjetaNombre      = document.getElementById('tarjetaNombre');
  var tarjetaVencimiento = document.getElementById('tarjetaVencimiento');
  var tarjetaCvv         = document.getElementById('tarjetaCvv');
  var transferenciaCuenta= document.getElementById('transferenciaCuenta');

  limpiarInvalido(tarjetaNumero);
  limpiarInvalido(tarjetaNombre);
  limpiarInvalido(tarjetaVencimiento);
  limpiarInvalido(tarjetaCvv);
  limpiarInvalido(transferenciaCuenta);

  if (metodo === 'tarjeta') {
    var ok = true;
    if (!tarjetaNumero || !tarjetaNumero.value.trim()) ok = marcarInvalido(tarjetaNumero, 'Ingresá el número de tarjeta.');
    if (!tarjetaNombre || !tarjetaNombre.value.trim()) ok = marcarInvalido(tarjetaNombre, 'Ingresá el titular.');
    if (!tarjetaVencimiento || !tarjetaVencimiento.value.trim()) ok = marcarInvalido(tarjetaVencimiento, 'Ingresá el vencimiento (MM/AA).');
    if (!tarjetaCvv || !tarjetaCvv.value.trim()) ok = marcarInvalido(tarjetaCvv, 'Ingresá el CVV.');
    return ok;
  }

  if (metodo === 'transferencia') {
    if (!transferenciaCuenta || !transferenciaCuenta.value.trim()) {
      return marcarInvalido(transferenciaCuenta, 'Ingresá el número de cuenta.');
    }
  }
  return true;
}

function mostrarExito(mensaje) {
  alert('¡Compra exitosa! ' + mensaje);
}

// Botón “Finalizar compra”
function finalizarCompra(evento) {
  if (evento && evento.preventDefault) evento.preventDefault();

  var okDireccion = validarDireccion();
  var okEnvio     = validarEnvio();
  var okCant      = validarCantidades();
  var okPago      = validarPago();

  if (okDireccion && okEnvio && okCant && okPago) {
    mostrarExito('Tu pedido fue procesado correctamente.');
  } else {
    desplazarAlPrimerError();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var boton = document.getElementById('finalizarCompraBtn');
  if (boton) {
    boton.addEventListener('click', finalizarCompra);
  }
  var formulario = document.getElementById('checkoutForm');
  if (formulario) {
    formulario.addEventListener('submit', finalizarCompra);
  }
});
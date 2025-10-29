document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  // Si el carrito está vacío
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="alert alert-info mt-3" role="alert">
        Tu carrito está vacío 🛒
      </div>`;
    subtotalElement.textContent = "Subtotal: USD 0";
    totalElement.textContent = "Total: USD 0";
    return;
  }

  // Renderizar los productos
  let subtotal = 0;
  cartContainer.innerHTML = ""; // limpiar antes de cargar

  cart.forEach((producto, index) => {
    const itemSubtotal = producto.unitCost * producto.count;
    subtotal += itemSubtotal;

    const item = document.createElement("div");
    item.classList.add("cart-item", "border", "rounded", "p-3", "mb-3", "d-flex", "justify-content-between", "align-items-center");

    item.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${producto.image}" alt="${producto.name}" class="me-3" style="width: 100px; height: 100px; object-fit: cover;">
        <div>
          <h5 class="mb-1">${producto.name}</h5>
          <p class="mb-1 text-muted">${producto.currency} ${producto.unitCost}</p>
          <button class="btn btn-sm btn-outline-danger eliminar-btn" data-index="${index}">
            <i class="fa fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
      <div class="text-end">
        <input type="number" min="1" value="${producto.count}" class="form-control cantidad-input mb-2" data-index="${index}" style="width: 80px; display: inline-block;">
        <p class="mb-0 fw-bold item-subtotal">${producto.currency} ${itemSubtotal}</p>
      </div>
    `;

    cartContainer.appendChild(item);
  });

  subtotalElement.textContent = `Subtotal: USD ${subtotal}`;
  totalElement.textContent = `Total: USD ${subtotal}`;

  // --- EVENTOS ---

  // Actualizar cantidad en tiempo real
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
      location.reload(); // recargar para reflejar los cambios
    });
  });

  // --- FUNCIONES AUXILIARES ---
  function actualizarTotales() {
    let nuevoSubtotal = 0;

    document.querySelectorAll(".cart-item").forEach((item, i) => {
      const cantidad = cart[i].count;
      const precio = cart[i].unitCost;
      const itemSubtotal = cantidad * precio;

      item.querySelector(".item-subtotal").textContent = `${cart[i].currency} ${itemSubtotal}`;
      nuevoSubtotal += itemSubtotal;
    });

    subtotalElement.textContent = `Subtotal: USD ${nuevoSubtotal}`;
    totalElement.textContent = `Total: USD ${nuevoSubtotal}`;
  }
});


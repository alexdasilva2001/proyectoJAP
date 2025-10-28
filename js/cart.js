document.addEventListener("DOMContentLoaded", () => {
  const carritoContainer = document.getElementById("carrito");
  const totalElem = document.getElementById("total");
  const botonVaciar = document.getElementById("vaciarCarrito");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  //  Función para calcular el subtotal
  function calcularSubtotal(precio, cantidad) {
    return precio * cantidad;
  }

  function renderCarrito() {
    carritoContainer.innerHTML = "";

    if (carrito.length === 0) {
      carritoContainer.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
      totalElem.textContent = "$0";
      return;
    }

    carrito.forEach((producto, index) => {
      const item = document.createElement("div");
      item.classList.add(
        "producto",
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "border-bottom",
        "py-2"
      );

      const subtotal = calcularSubtotal(producto.precio, producto.cantidad);

      item.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${producto.imagen}" alt="${producto.nombre}" width="60">
          <div>
            <h6>${producto.nombre}</h6>
            <p class="mb-0 text-muted">${producto.moneda} ${producto.precio}</p>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <input type="number" class="cantidad form-control" style="width:70px" value="${producto.cantidad}" min="1">
          <span class="subtotal fw-bold">${producto.moneda} ${subtotal.toLocaleString()}</span>
          <button class="btn btn-sm btn-danger eliminar" data-index="${index}">🗑</button>
        </div>
      `;
      carritoContainer.appendChild(item);
    });

    agregarEventosCantidad();
    agregarEventosEliminar();
    actualizarTotal();
  }

  function agregarEventosCantidad() {
    const productos = document.querySelectorAll(".producto");

    productos.forEach((producto, index) => {
      const cantidadInput = producto.querySelector(".cantidad");
      const subtotalElem = producto.querySelector(".subtotal");

      cantidadInput.addEventListener("input", () => {
        const cantidad = parseInt(cantidadInput.value) || 1;
        carrito[index].cantidad = cantidad;

        const subtotal = calcularSubtotal(carrito[index].precio, cantidad);
        subtotalElem.textContent = `${carrito[index].moneda} ${subtotal.toLocaleString()}`;

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarTotal();
      });
    });
  }

  function agregarEventosEliminar() {
    document.querySelectorAll(".eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
      });
    });
  }

  function actualizarTotal() {
    let total = 0;
    carrito.forEach((p) => {
      total += calcularSubtotal(p.precio, p.cantidad);
    });

    //  Si todos los productos usan la misma moneda, mostramos esa
    const moneda = carrito.length > 0 ? carrito[0].moneda : "USD";
    totalElem.textContent = `${moneda} ${total.toLocaleString()}`;
  }

  //  Vaciar carrito
  if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      carrito = [];
      renderCarrito();
    });
  }

  renderCarrito();
});

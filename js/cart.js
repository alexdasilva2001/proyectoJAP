document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");

  // 💱 Tasas de conversión simuladas (puedes ajustarlas)
  const conversionRates = {
    USD: 0.025,
    UYU: 1,
  };

  function convertPrice(costoUYU, currency) {
    return costoYU * conversionRates[currency];
  }

  // 🎨 Render del carrito
  function renderCart() {
    if (cartProducts.length === 0) {
      cartContainer.innerHTML = `<p>No hay productos en el carrito.</p>`;
      return;
    }

    cartContainer.innerHTML = `
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%; text-align:center;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Imagen</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Moneda</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${cartProducts
            .map(
              (product, index) => `
                <tr>
                  <td>${producto.name}</td>
                  <td>${producto.image}</td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value="${producto.quantity}" 
                      data-index="${index}" 
                      class="quantity-input"
                      style="width:60px;"
                    >
                  </td>
                  <td class="price-cell" data-index="${index}">
                    ${convertPrice(producto.costUSD, producto.currency).toFixed(2)}
                  </td>
                  <td>
                    <select data-index="${index}" class="currency-select">
                      <option value="USD" ${producto.currency === "USD" ? "selected" : ""}>USD</option>
                      <option value="UYU" ${producto.currency === "UYU" ? "selected" : ""}>UYU</option>
                    </select>
                  </td>
                  <td class="total-cell" data-index="${index}">
                    ${(
                      convertPrice(product.costoUYU, product.currency) * product.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <p id="grand-total" style="margin-top:10px; font-weight:bold;">
        Total a pagar: ${calculateGrandTotal().toFixed(2)} ${cartProducts[0].currency}
      </p>
    `;

    addEventListeners();
  }

  // 🔁 Agregar eventos a inputs y selects
  function addEventListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        const newQuantity = parseInt(e.target.value) || 1;
        cartProducts[index].quantity = newQuantity;
        updateTotals();
      });
    });

    document.querySelectorAll(".currency-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        const newCurrency = e.target.value;
        cartProducts[index].currency = newCurrency;
        updateTotals();
      });
    });
  }

  function updateTotals() {
    let totalGeneral = 0;

    cartProducts.forEach((product, index) => {
      const priceCell = document.querySelector(`.price-cell[data-index="${index}"]`);
      const totalCell = document.querySelector(`.total-cell[data-index="${index}"]`);

      const price = convertPrice(product.priceUYU, product.currency);
      const subtotal = price * product.quantity;

      priceCell.textContent = price.toFixed(2);
      totalCell.textContent = subtotal.toFixed(2);

      totalGeneral += subtotal;
    });

    document.getElementById("grand-total").textContent = 
      `Total a pagar: ${totalGeneral.toFixed(2)} ${cartProducts[0].currency}`;
  }

  function calculateGrandTotal() {
    return cartProducts.reduce(
      (sum, p) => sum + convertPrice(p.priceUYU, p.currency) * p.quantity,
      0
    );
  }

  // 🚀 Inicializar
  renderCart();
});

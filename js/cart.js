document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");

  // 💱 Tasas de conversión simuladas (puedes ajustarlas)
  const conversionRates = {
    USD: 0.025,
    UYU: 1,
  };

  // 🧮 Función auxiliar: convertir precio según moneda
  function convertPrice(priceUYU, currency) {
    return priceUYU * conversionRates[currency];
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
                  <td>${product.name}</td>
                  <td>${product.image}</td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value="${product.quantity}" 
                      data-index="${index}" 
                      class="quantity-input"
                      style="width:60px;"
                    >
                  </td>
                  <td class="price-cell" data-index="${index}">
                    ${convertPrice(product.priceUSD, product.currency).toFixed(2)}
                  </td>
                  <td>
                    <select data-index="${index}" class="currency-select">
                      <option value="USD" ${product.currency === "USD" ? "selected" : ""}>USD</option>
                      <option value="UYU" ${product.currency === "UYU" ? "selected" : ""}>UYU</option>
                      <option value="EUR" ${product.currency === "EUR" ? "selected" : ""}>EUR</option>
                    </select>
                  </td>
                  <td class="total-cell" data-index="${index}">
                    ${(
                      convertPrice(product.priceUSD, product.currency) * product.quantity
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

  // 🧮 Actualizar totales y precios al cambiar cantidad o moneda
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

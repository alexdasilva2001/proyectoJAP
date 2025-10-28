document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalCostElement = document.getElementById("total-cost");

  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

  const conversionRates = { USD: 0.025, UYU: 1 };

  function convertPrice(costoUYU, currency) {
    return costoUYU * conversionRates[currency];
  }

  function updateTotalGeneral() {
    const total = cartProducts.reduce((sum, p) => {
      return sum + convertPrice(p.costoUYU, p.currency) * p.quantity;
    }, 0);
    totalCostElement.textContent = total.toFixed(2);
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    cartProducts.forEach((product, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.name}</td>
        <td><img src="${product.image}" alt="${product.name}" width="60"></td>
        <td class="price-cell" data-index="${index}">
          ${convertPrice(product.costoUYU, product.currency).toFixed(2)}
        </td>
        <td>
          <input type="number" min="1" value="${product.quantity}" 
            class="quantity-input" data-index="${index}" style="width:60px;">
        </td>
        <td>
          <select class="currency-select" data-index="${index}">
            <option value="UYU" ${product.currency === "UYU" ? "selected" : ""}>$U</option>
            <option value="USD" ${product.currency === "USD" ? "selected" : ""}>US$</option>
          </select>
        </td>
        <td class="total-cell" data-index="${index}">
          ${(convertPrice(product.costoUYU, product.currency) * product.quantity).toFixed(2)}
        </td>
      `;

      cartItemsContainer.appendChild(row);
    });

    updateTotalGeneral();
    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        cartProducts[index].quantity = parseInt(e.target.value) || 1;
        updateRow(index);
      });
    });

    document.querySelectorAll(".currency-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        cartProducts[index].currency = e.target.value;
        updateRow(index);
      });
    });
  }

  function updateRow(index) {
    const product = cartProducts[index];
    const priceCell = document.querySelector(`.price-cell[data-index="${index}"]`);
    const price = convertPrice(product.costoUYU, product.currency);

    priceCell.textContent = price.toFixed(2);
  

    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }

  renderCart();
});
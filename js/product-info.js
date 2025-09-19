document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("productID");
  if (!productID) {
    window.location = "products.html";
    return;
  }

  const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      document.getElementById("product-image").src = data.images[0] || "";
      document.getElementById("product-image").alt = data.name || "Producto";

      document.getElementById("product-name").textContent = data.name || "";
      document.getElementById("product-description").textContent = data.description || "";
      document.getElementById("product-category").textContent = data.category || "";
      document.getElementById("product-current-price").textContent = data.currency && data.cost ? `${data.currency} ${data.cost}` : "";
      document.getElementById("product-sold-count").textContent = data.soldCount != null ? `${data.soldCount} vendidos` : "";
    })
    .catch(error => {
      document.getElementById("product-name").textContent = "Error al cargar producto";
      console.error(error);
    });
});

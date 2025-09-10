console.log("products.js cargado correctamente");
document.addEventListener("DOMContentLoaded", function () {
  const catID = localStorage.getItem("catID");

  if (!catID) {
    document.getElementById("productList").innerHTML = `<p>No se encontró una categoría seleccionada.</p>`;
    return;
  }

  const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
  const productList = document.getElementById("productList");

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const productos = data.products;

      productos.forEach(p => {
        productList.innerHTML += `
          <div class="product-card">
            <div class="product-title">${p.name}</div>
           <img src="${p.image}" alt="${p.name}" class="product-image" />
            <div class="product-description">${p.description}</div>
            <div class="product-price">Precio: ${p.currency} ${p.cost}</div>
            <div class="product-footer">Vendidos: ${p.soldCount}</div>
          </div>
        `;
      });
    })
    .catch(error => {
      productList.innerHTML = `<p>Error al cargar productos: ${error}</p>`;
    });
});

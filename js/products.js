// Obtener el ID de categoría desde el localStorage
const categoryId = localStorage.getItem("selectedCategoryId");

// Validar que exista el ID antes de construir la URL
if (categoryId) {
  const URL_AUTOS = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;
  const productList = document.getElementById("productList");

  fetch(URL_AUTOS)
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
} else {
  // Si no hay ID guardado, mostrar mensaje o redirigir
  document.getElementById("productList").innerHTML = `<p>No se encontró una categoría seleccionada.</p>`;
}
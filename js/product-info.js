document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del producto desde localStorage
  const productID = localStorage.getItem("productID");

  // Si no hay ID, redirigir a la lista de productos
  if (!productID) {
    window.location = "products.html";
    return;
  }

  // URL del producto actual
  const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      // Mostrar información del producto principal
      document.getElementById("product-image").src = data.images[0] || "";
      document.getElementById("product-image").alt = data.name || "Producto";
      document.getElementById("product-name").textContent = data.name || "";
      document.getElementById("product-description").textContent = data.description || "";
      document.getElementById("product-category").textContent = data.category || "";
      document.getElementById("product-current-price").textContent = data.currency && data.cost ? `${data.currency} ${data.cost}` : "";
      document.getElementById("product-sold-count").textContent = data.soldCount != null ? `${data.soldCount} vendidos` : "";

      // Buscar el ID de la categoría a partir del nombre
      fetch("https://japceibal.github.io/emercado-api/cats/cat.json")
        .then(response => response.json())
        .then(categorias => {
          const categoriaEncontrada = categorias.find(c => c.name === data.category);
          if (!categoriaEncontrada) return;

          const categoriaID = categoriaEncontrada.id;
          const categoriaURL = `https://japceibal.github.io/emercado-api/cats_products/${categoriaID}.json`;

          // Obtener productos de la misma categoría
          fetch(categoriaURL)
            .then(response => response.json())
            .then(catData => {
              const relacionados = catData.products.filter(p => p.id != productID);
              mostrarRelacionados(relacionados);
            });
        });
    })
    .catch(error => {
      document.getElementById("product-name").textContent = "Error al cargar producto";
      console.error(error);
    });
});

// Mostrar productos relacionados
function mostrarRelacionados(productos) {
  const contenedor = document.getElementById("related-products");
  contenedor.innerHTML = "";

  productos.slice(0, 3).forEach(producto => {
    const html = `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
          <div class="card-body">
            <h5 class="card-title">${producto.name}</h5>
            <p class="card-text">${producto.currency} ${producto.cost}</p>
            <button class="btn btn-outline-primary" onclick="verProducto(${producto.id})">Ver más</button>
          </div>
        </div>
      </div>
    `;
    contenedor.innerHTML += html;
  });
}

// Redirigir al producto recomendado
function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}
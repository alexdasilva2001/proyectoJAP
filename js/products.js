document.addEventListener("DOMContentLoaded", function () {
  const catID = localStorage.getItem("catID");
  const nombreCategoria = localStorage.getItem("catName") || "productos"; // Nombre de categoría

console.log("products.js cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("productList");
  const sortOptions = document.getElementById("sortOptions");
  const filterButton = document.getElementById("filterButton");
  const minInput = document.getElementById("preciominimo");
  const maxInput = document.getElementById("preciomaximo");
  const buscador = document.getElementById("buscador");

  buscador.placeholder = `Buscar ${nombreCategoria}...`;

  let productos = [];
  let productosFiltrados = [];

  if (!catID) {
    productList.innerHTML = `<p>No se encontró una categoría seleccionada.</p>`;
    return;
  }

  const URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  function renderProducts(lista) {
    productList.innerHTML = "";
    if (lista.length === 0) {
      productList.innerHTML = `<p>No se encontraron productos con los filtros aplicados.</p>`;
      return;
    }
    lista.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product-card", "cursor-active");

      card.innerHTML = `
        <h2 class="product-title">${p.name}</h2>
        <img class="product-image" src="${p.image}" alt="${p.name}">
        <p class="product-description">${p.description}</p>
        <p class="product-price">Precio: ${p.currency} ${p.cost}</p>
        <div class="product-footer">Vendidos: ${p.soldCount}</div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("productID", p.id);
        window.location = "product-info.html";
      });

      productList.appendChild(card);
    });
  }

  function aplicarFiltrosPrecio() {
    const min = parseInt(minInput.value) || 0;
    const max = parseInt(maxInput.value) || Infinity;
    productosFiltrados = productos.filter(p => p.cost >= min && p.cost <= max);
    aplicarOrden();
  }

  function aplicarOrden() {
    const opcion = sortOptions.value;
    let listaOrdenada = [...productosFiltrados];
    switch (opcion) {
      case "priceAsc":
        listaOrdenada.sort((a, b) => a.cost - b.cost);
        break;
      case "priceDesc":
        listaOrdenada.sort((a, b) => b.cost - a.cost);
        break;
      case "soldCountDesc":
        listaOrdenada.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case "soldCountAsc":
        listaOrdenada.sort((a, b) => a.soldCount - b.soldCount);
        break;
    }
    renderProducts(listaOrdenada);
  }

  function aplicarBusqueda() {
    const texto = buscador.value.toLowerCase();
    const listaFiltrada = productosFiltrados.filter(p =>
      p.name.toLowerCase().includes(texto) ||
      p.description.toLowerCase().includes(texto)
    );
    renderProducts(listaFiltrada);

  sortOptions.addEventListener("change", aplicarOrden);
  filterButton.addEventListener("click", aplicarFiltrosPrecio);
  buscador.addEventListener("input", aplicarBusqueda);

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      productos = data.products;
      productosFiltrados = [...productos];
      renderProducts(productos);
    })
    .catch(error => {
      productList.innerHTML = `<p>Error al cargar productos: ${error}</p>`;
    });

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

const sortOptions = document.getElementById("sortOptions"); 
const filterButton = document.getElementById("filterButton");
const minInput = document.getElementById("preciominimo");
const maxInput = document.getElementById("preciomaximo");

let productos = [];
let productosFiltrados = []; 

// Renderizar productos en pantalla
function renderProducts(lista) {
  productList.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <h2 class="product-title">${p.name}</h2>
      <img class="product-image" src="${p.image}" alt="${p.name}">
      <p class="product-description">${p.description}</p>
      <p class="product-price">$${p.cost}</p>
      <div class="product-footer">Vendidos: ${p.soldCount}</div>
    `;

    productList.appendChild(card);
  });
}




// Aplicar filtros de precio
function aplicarFiltrosPrecio() {
  const min = parseInt(minInput.value) || 0;
  const max = parseInt(maxInput.value) || Infinity;

  productosFiltrados = productos.filter(p => p.cost >= min && p.cost <= max);
  aplicarOrden();
}

// Ordenar productos según opción seleccionada
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
    default:
      listaOrdenada = [...productosFiltrados]; // lista predeterminada
  }

  renderProducts(listaOrdenada);
}

// Eventos
sortOptions.addEventListener("change", aplicarOrden);
filterButton.addEventListener("click", aplicarFiltrosPrecio);

// Cargar productos desde la API
fetch(URL_AUTOS)
  .then(response => response.json())
  .then(data => {
    productos = data.products;
    productosFiltrados = [...productos];
    renderProducts(productos);
  })
  .catch(error => {
    productList.innerHTML = `<p>Error al cargar productos: ${error}</p>`;
  });

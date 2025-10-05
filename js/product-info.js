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

// Obtener el ID del producto que está en localStorage
const productID = localStorage.getItem("productID");

// Constante para la URL de comentarios
const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

// Función para obtener comentarios guardados del localStorage
function getStoredComments() {
  const storedComments = localStorage.getItem(`comments_${productID}`);
  return storedComments ? JSON.parse(storedComments) : [];
}

// Función para guardar comentarios en localStorage
function saveComment(comment) {
  const storedComments = getStoredComments();
  storedComments.push(comment);
  localStorage.setItem(`comments_${productID}`, JSON.stringify(storedComments));
}

// Variable global para guardar la puntuación seleccionada
let rating = 0;

// Seleccionar las estrellas
const stars = document.querySelectorAll('.star-icon');

// Hacer interactivas las estrellas
stars.forEach((star, index) => {
  star.addEventListener('mouseover', () => {
    resetStars();
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add('active');
    }
  });

  star.addEventListener('mouseout', () => {
    resetStars();
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add('active');
    }
  });

  star.addEventListener('click', () => {
    rating = index + 1; // Guardar puntuación seleccionada
    console.log("Puntuación seleccionada:", rating);
  });
});

function resetStars() {
  stars.forEach(star => star.classList.remove('active'));
}

// Función para mostrar comentarios
function mostrarComentarios(listaAPI) {
  const commentsList = document.getElementById("comments-list");
  commentsList.innerHTML = ""; // Limpiar contenedor

  // Obtener comentarios guardados
  const comentariosGuardados = getStoredComments();
  
  // Combinar comentarios de API y localStorage
  const todosLosComentarios = [...listaAPI, ...comentariosGuardados];
  
  // Ordenar por fecha más reciente
  todosLosComentarios.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  todosLosComentarios.forEach(comentario => {
    const div = document.createElement("div");
    div.classList.add("comentario", "mb-3");

    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= comentario.score) {
        estrellas += '<i class="fa fa-star text-warning"></i>';
      } else {
        estrellas += '<i class="fa fa-star text-secondary"></i>';
      }
    }

    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <strong>${comentario.user}</strong>
        <small class="text-muted">${comentario.dateTime}</small>
      </div>
      <div class="my-1">${estrellas}</div>
      <p class="mb-0">${comentario.description}</p>
    `;

    commentsList.appendChild(div);
  });
}

// Cargar comentarios de la API
fetch(COMMENTS_URL)
  .then(response => response.json())
  .then(data => {
    mostrarComentarios(data);
  })
  .catch(error => {
    console.error("Error al cargar comentarios:", error);
    mostrarComentarios([]); // Mostrar al menos los comentarios locales si falla la API
  });

// Manejar el envío de nuevos comentarios
const form = document.getElementById("comment-form");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const texto = document.getElementById("comment-input").value;
    const usuario = localStorage.getItem("user") || "Anónimo";
    
    if (texto.trim() === "" || rating === 0) return;

    const nuevoComentario = {
      user: usuario,
      description: texto,
      score: rating,
      dateTime: new Date().toLocaleString()
    };

    saveComment(nuevoComentario);
    
    // Recargar todos los comentarios
    fetch(COMMENTS_URL)
      .then(response => response.json())
      .then(data => {
        mostrarComentarios(data);
      });

    // Limpiar formulario
    form.reset();
    rating = 0;
    resetStars();
  });
}

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

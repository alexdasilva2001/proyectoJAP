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

// Mostrar comentarios cargados desde la API
function mostrarComentarios(lista) {
  const commentsList = document.getElementById("comments-list");
  commentsList.innerHTML = ""; // limpiar antes de mostrar

  lista.forEach(comentario => {
    agregarComentario(comentario);
  });
}

// Agregar un comentario al DOM
function agregarComentario(comentario) {
  const commentsList = document.getElementById("comments-list");

  const div = document.createElement("div");
  div.classList.add("comentario", "mb-3", "p-2", "border", "rounded");

  // Pintar estrellas según el score
  let estrellasHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= comentario.score) {
      estrellasHTML += `<i class="fa fa-star text-warning"></i>`;
    } else {
      estrellasHTML += `<i class="fa fa-star text-secondary"></i>`;
    }
  }

  div.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <strong>${comentario.user}</strong>
      <small class="text-muted">${comentario.dateTime}</small>
    </div>
    <div>${estrellasHTML}</div>
    <p class="mt-2 mb-0">${comentario.description}</p>
  `;

  commentsList.prepend(div);
}

// Cargar comentarios desde la API
fetch(COMMENTS_URL)
  .then(response => response.json())
  .then(data => {
    mostrarComentarios(data);
  });

// Evento para enviar un nuevo comentario
const form = document.getElementById("comment-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const texto = document.getElementById("comment-input").value; // 👈 textarea correcto
    const fecha = new Date().toLocaleString();
    const usuario = "Usuario";

    if (texto.trim() === "" || rating === 0) return; // no dejar enviar vacío ni sin estrellas

    // Crear un objeto nuevo comentario
    const nuevoComentario = {
      user: usuario,
      description: texto,
      score: rating,
      dateTime: fecha
    };

    // Agregarlo visualmente
    agregarComentario(nuevoComentario);

    // Limpiar formulario y resetear estrellas
    form.reset();
    rating = 0;
    resetStars();
  });
}

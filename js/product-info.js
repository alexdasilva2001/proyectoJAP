document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del producto desde localStorage
  const productID = localStorage.getItem("productID");
  if (!productID) {
    window.location = "products.html";
    return;
  }

  const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

  // --- Cargar producto principal ---
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("product-image").src = data.images[0] || "";
      document.getElementById("product-image").alt = data.name || "Producto";
      document.getElementById("product-name").textContent = data.name || "";
      document.getElementById("product-description").textContent =
        data.description || "";
      document.getElementById("product-category").textContent =
        data.category || "";
      document.getElementById("product-current-price").textContent =
        data.currency && data.cost ? `${data.currency} ${data.cost}` : "";
      document.getElementById("product-sold-count").textContent =
        data.soldCount != null ? `${data.soldCount} vendidos` : "";

      // Botón "Comprar"
      const btn = document.querySelector(".btn-buy");
      if (btn) {
        btn.addEventListener("click", function () {
          const item = {
            id: data.id,
            name: data.name,
            currency: data.currency,
            unitCost: data.cost,
            image: data.images?.[0] || "",
            count: 1,
          };

          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existing = cart.find((p) => p.id === item.id);

          if (existing) existing.count++;
          else cart.push(item);

          localStorage.setItem("cart", JSON.stringify(cart));
          window.location = "cart.html";
        });
      }

      // Cargar productos relacionados
      fetch("https://japceibal.github.io/emercado-api/cats/cat.json")
        .then((res) => res.json())
        .then((categorias) => {
          const categoria = categorias.find((c) => c.name === data.category);
          if (!categoria) return;
          const categoriaURL = `https://japceibal.github.io/emercado-api/cats_products/${categoria.id}.json`;

          return fetch(categoriaURL)
            .then((res) => res.json())
            .then((catData) => {
              const relacionados = catData.products.filter(
                (p) => p.id != productID
              );
              mostrarRelacionados(relacionados);
            });
        })
        .catch((err) => console.error("Error cargando categoría:", err));
    })
    .catch((err) => {
      document.getElementById("product-name").textContent =
        "Error al cargar producto";
      console.error(err);
    });

  // --- Comentarios ---
  function getStoredComments() {
    const stored = localStorage.getItem(`comments_${productID}`);
    return stored ? JSON.parse(stored) : [];
  }

  function saveComment(comment) {
    const stored = getStoredComments();
    stored.push(comment);
    localStorage.setItem(`comments_${productID}`, JSON.stringify(stored));
  }

  let rating = 0;
  const stars = document.querySelectorAll(".star-icon");

  function resetStars() {
    stars.forEach((s) => s.classList.remove("active"));
  }

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      resetStars();
      for (let i = 0; i <= index; i++) stars[i].classList.add("active");
    });

    star.addEventListener("mouseout", () => {
      resetStars();
      for (let i = 0; i < rating; i++) stars[i].classList.add("active");
    });

    star.addEventListener("click", () => (rating = index + 1));
  });

  function mostrarComentarios(listaAPI) {
    const container = document.getElementById("comments-list");
    container.innerHTML = "";

    const locales = getStoredComments();
    const todos = [...listaAPI, ...locales].sort(
      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
    );

    todos.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("comentario", "mb-3");

      let estrellas = "";
      for (let i = 1; i <= 5; i++) {
        estrellas += `<i class="fa fa-star ${
          i <= c.score ? "text-warning" : "text-secondary"
        }"></i>`;
      }

      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <strong>${c.user}</strong>
          <small class="text-muted">${c.dateTime}</small>
        </div>
        <div class="my-1">${estrellas}</div>
        <p class="mb-0">${c.description}</p>
      `;
      container.appendChild(div);
    });
  }

  fetch(COMMENTS_URL)
    .then((r) => r.json())
    .then((data) => mostrarComentarios(data))
    .catch((err) => {
      console.error("Error al cargar comentarios:", err);
      mostrarComentarios([]);
    });

  const form = document.getElementById("comment-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const texto = document.getElementById("comment-input").value.trim();
      const user = sessionStorage.getItem("user") || "Anónimo";

      if (!texto || rating === 0) {
        showAlert(
          "Debes escribir un comentario y dar una calificación",
          "warning"
        );
        return;
      }

      const nuevo = {
        user,
        description: texto,
        score: rating,
        dateTime: new Date().toLocaleString(),
      };

      saveComment(nuevo);

      fetch(COMMENTS_URL)
        .then((r) => r.json())
        .then((data) => {
          mostrarComentarios(data);
          showAlert("Comentario publicado exitosamente", "success");
        });

      form.reset();
      rating = 0;
      resetStars();
    });
  }

  function showAlert(msg, type) {
    const cont = document.getElementById("comments-list");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    cont.insertBefore(wrapper, cont.firstChild);
    setTimeout(() => wrapper.firstElementChild.remove(), 3000);
  }

  function mostrarRelacionados(productos) {
    const container = document.getElementById("related-products");
    container.innerHTML = "";
    for (let i = 0; i < productos.length; i += 3) {
      const grupo = productos.slice(i, i + 3);
      const div = document.createElement("div");
      div.className = `carousel-item ${i === 0 ? "active" : ""}`;
      div.innerHTML = `
        <div class="row">
          ${grupo
            .map(
              (p) => `
            <div class="col-md-4">
              <div class="related-card" onclick="verProducto(${p.id})">
                <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
                <h5>${p.name}</h5>
                <p>${p.currency} ${p.cost}</p>
              </div>
            </div>`
            )
            .join("")}
        </div>`;
      container.appendChild(div);
    }
  }
});

// Redirigir a producto relacionado
function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

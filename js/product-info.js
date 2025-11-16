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

// FUNCIÓN PARA AGREGAR AL CARRITO (USANDO count)
function agregarAlCarrito(product) {
  // Obtener carrito del localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Revisar si el producto ya está en el carrito
  const index = cart.findIndex(p => p.id === product.id);
  if (index !== -1) {
    // Si ya existe, aumentar cantidad
    cart[index].count = (cart[index].count || 0) + 1;
  } else {
    // Si no existe, agregar con count = 1 y campos unificados
    cart.push({
      id: product.id,
      name: product.name,
      image: (product.images && product.images[0]) || product.image || "",
      unitCost: product.cost || product.unitCost || 0,
      currency: product.currency || "UYU",
      count: 1
    });
  }

  // Guardar carrito actualizado en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualizar numerito del carrito en la navbar
  actualizarBadgeCarrito();

  // Alerta opcional
  if (typeof showAlert === "function") showAlert("Producto agregado al carrito", "success");
}

// FUNCIÓN GLOBAL: actualizar numerito del carrito
function actualizarBadgeCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((acc, prod) => acc + (prod.count || 0), 0);

  badge.textContent = total;
  badge.style.display = total > 0 ? "inline" : "none";
}

// Ejecutar al cargar la página para sincronizar badge
document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);

// ASOCIAR CLICK AL ÍCONO / BOTÓN "AGREGAR AL CARRITO"
document.addEventListener("DOMContentLoaded", () => {
  const handleAddToCart = (redirectToCart = false) => {
    const productID = localStorage.getItem("productID");
    if (!productID) return;

    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
      .then(response => response.json())
      .then(product => {
        agregarAlCarrito(product);
        if (redirectToCart) window.location = "cart.html";
      })
      .catch(err => console.error("Error al agregar al carrito:", err));
  };

  const addBtnIcon = document.getElementById("add-to-cart-btn");
  if (addBtnIcon) {
    addBtnIcon.addEventListener("click", () => handleAddToCart(false));
  }

  const buyBtn = document.querySelector(".btn-buy");
  if (buyBtn) {
    buyBtn.addEventListener("click", () => handleAddToCart(true));
  }
});
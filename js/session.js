// session.js

document.addEventListener("DOMContentLoaded", () => {
  const barra = document.getElementById("usuariobarra");
  const userNavLink = document.getElementById("userNavLink");

  function actualizarNavbar() {
    if (!barra || !userNavLink) return;

    const usuarioGuardado = localStorage.getItem("usuario");
    const avatarGuardado =
      localStorage.getItem("miAvatar") || "img/Generic avatar.png";

    if (usuarioGuardado) {
      // Limpiar el contenido anterior
      barra.innerHTML = '';

      // Crear imagen de avatar
      const avatarImg = document.createElement("img");
      avatarImg.src = avatarGuardado;
      avatarImg.alt = "Avatar";
      avatarImg.style.width = "30px";
      avatarImg.style.height = "30px";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.objectFit = "cover";
      avatarImg.classList.add("me-2");

      // Crear span con nombre
      const nombreSpan = document.createElement("span");
      nombreSpan.textContent = usuarioGuardado;

      // Agregar elementos al navbar
      barra.appendChild(avatarImg);
      barra.appendChild(nombreSpan);

      userNavLink.setAttribute("href", "my-profile.html");
    } else {
      barra.innerHTML = "Inicia sesión / Regístrate";
      userNavLink.setAttribute("href", "login.html");
    }
  }

  // Redirección si ya está logueado
  const ruta = window.location.pathname;
  if (
    localStorage.getItem("logueado") === "true" &&
    (ruta.includes("login.html") || ruta.includes("register.html"))
  ) {
    window.location.href = "index.html";
  }

  // Captura el form de login
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      const usuario = document.getElementById("usuario")?.value.trim();
      const contraseña = document.getElementById("contraseña")?.value.trim();
      if (usuario && contraseña) {
        localStorage.setItem("logueado", "true");
        localStorage.setItem("usuario", usuario);
        if (!localStorage.getItem("miAvatar")) {
          localStorage.setItem("miAvatar", "img/Generic avatar.png");
        }
        // Actualizar navbar inmediatamente
        actualizarNavbar();
      }
    });
  }

  // Actualizar navbar al cargar la página
  actualizarNavbar();

  // Escuchar cambios en localStorage (útil si se actualiza desde otra pestaña o my-profile)
  window.addEventListener('storage', (e) => {
    if (e.key === 'usuario' || e.key === 'miAvatar') {
      actualizarNavbar();
    }
  });
});
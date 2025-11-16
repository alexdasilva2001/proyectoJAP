// login.js

document.addEventListener("DOMContentLoaded", () => {
  const CONFIG = { MIN_PASSWORD_LENGTH: 6, EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };

  function validarEmail(email) {
    return CONFIG.EMAIL_REGEX.test(email);
  }

  function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    input.classList.add("is-invalid");
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.textContent = mensaje;
    input.parentNode.appendChild(errorDiv);
  }

  function limpiarErrores() {
    document.querySelectorAll(".is-invalid").forEach(e => e.classList.remove("is-invalid"));
    document.querySelectorAll(".invalid-feedback").forEach(e => e.remove());
  }

  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    limpiarErrores();

    const usuario = document.getElementById("usuario")?.value.trim();
    const contraseña = document.getElementById("contraseña")?.value.trim();
    const correo = document.getElementById("correo")?.value.trim();
    let hayErrores = false;

    if (!usuario || !contraseña || !correo) {
      mostrarError("usuario", "Todos los campos son obligatorios");
      hayErrores = true;
    }

    if (correo && !validarEmail(correo)) {
      mostrarError("correo", "El email no es válido");
      hayErrores = true;
    }

    if (contraseña && contraseña.length < CONFIG.MIN_PASSWORD_LENGTH) {
      mostrarError("contraseña", `La contraseña debe tener al menos ${CONFIG.MIN_PASSWORD_LENGTH} caracteres`);
      hayErrores = true;
    }

    if (hayErrores) return;

    // Guardar datos
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("correo", correo);
    localStorage.setItem("logueado", "true");
    if (!localStorage.getItem("miAvatar")) localStorage.setItem("miAvatar", "img/Generic avatar.png");

    // Toast de éxito
    const toast = new bootstrap.Toast(document.getElementById("loginToast"));
    toast.show();

    setTimeout(() => window.location.href = "my-profile.html", 1500);
  });

  // Redirección si ya está logueado
  const ruta = window.location.pathname;
  if (localStorage.getItem("logueado") === "true" &&
      (ruta.includes("login.html") || ruta.includes("register.html"))) {
    window.location.href = "index.html";
  }
});

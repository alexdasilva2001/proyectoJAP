// Esto hace que un usuario que ya está logueado, no vuelva a login.html:
if (
  localStorage.getItem("logueado") === "true" &&
  window.location.pathname.includes("login.html")
) {
  window.location.href = "index.html";
}

// Captura el form del login:
const form = document.querySelector("form");
if (form) {
form.addEventListener("submit", function (event) {
  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = document.getElementById("contraseña").value.trim();
  if (usuario !== "" && contraseña !== "") {
    localStorage.setItem("logueado", "true");
    localStorage.setItem("usuario", usuario);
  }
});
}

// Carga la pág.:
document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuario");
  const barra = document.getElementById("usuariobarra");
  const userNavLink = document.getElementById("userNavLink");

  if (usuarioGuardado) {
    // Esto muestra el usuario en la navbar:
    if (barra) barra.innerHTML = usuarioGuardado;
    //Esto hace que el link lleve al perfil:
    if (userNavLink) userNavLink.setAttribute("href", "my-profile.html");

    // Si existe usuario, mostrarlo en el perfil:
    const guardado = document.getElementById("usuarioguardado");
    if (guardado) guardado.innerHTML = usuarioGuardado;

    // Con esto se ocultan los "Inicia sesión" y "Regístrate":
    const loginLinks = document.querySelector(".login-links");
    if (loginLinks) loginLinks.style.display = "none";
  } else {
    // Sin usuario: texto por defecto + link a login
    if (barra) barra.textContent = "Inicia sesión / Regístrate";
    if (userNavLink) userNavLink.setAttribute("href", "login.html");
  }
});

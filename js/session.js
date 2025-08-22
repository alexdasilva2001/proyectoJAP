if (localStorage.getItem("logueado") === "true" && window.location.pathname.includes("login.html")) {
  window.location.href = "products.html";
}

const form = document.querySelector("form"); 
form.addEventListener("submit", function(event) {
  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  if (usuario !== "" && contraseña !== "") {
    localStorage.setItem("logueado", "true");
  }
});
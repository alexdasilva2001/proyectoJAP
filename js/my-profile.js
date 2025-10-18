// my-profile.js

document.addEventListener("DOMContentLoaded", () => {
  const barra = document.getElementById("usuariobarra");
  const userNavLink = document.getElementById("userNavLink");
  const profileForm = document.getElementById("profileForm");
  const editarPerfilBtn = document.getElementById("editarPerfilBtn");
  const guardarCambiosBtn = document.getElementById("guardarCambiosBtn");
  const editarFotoBtn = document.getElementById("editarFotoBtn");
  const inputFoto = document.getElementById("inputFoto");
  const fotoPerfil = document.getElementById("fotoPerfil");
  const nombreUsuario = document.getElementById("nombreUsuario");

  const camposIds = ["nombre", "apellido", "usuario", "telefono", "correo"];
  const camposPerfil = camposIds.map(id => document.getElementById(id));

  function actualizarNavbar() {
    if (!barra || !userNavLink) return;
    barra.innerHTML = '';

    const usuarioGuardado = localStorage.getItem("usuario");
    const avatarGuardado = localStorage.getItem("miAvatar") || "img/Generic avatar.png";

    if (usuarioGuardado) {
      const avatarImg = document.createElement("img");
      avatarImg.src = avatarGuardado;
      avatarImg.alt = "Avatar";
      avatarImg.style.width = "30px";
      avatarImg.style.height = "30px";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.objectFit = "cover";
      avatarImg.classList.add("me-2");

      const nombreSpan = document.createElement("span");
      nombreSpan.textContent = usuarioGuardado;

      barra.appendChild(avatarImg);
      barra.appendChild(nombreSpan);

      userNavLink.setAttribute("href", "my-profile.html");
    } else {
      barra.textContent = "Inicia sesión / Regístrate";
      userNavLink.setAttribute("href", "login.html");
    }
  }

  function cargarDatosPerfil() {
    camposPerfil.forEach(input => {
      const valor = localStorage.getItem(input.id);
      if (valor) input.value = valor;
    });

    if (nombreUsuario) nombreUsuario.textContent = localStorage.getItem("usuario") || '';
    if (fotoPerfil) fotoPerfil.src = localStorage.getItem("miAvatar") || "img/Generic avatar.png";
    actualizarNavbar();
  }

  function guardarDatosPerfil() {
    camposPerfil.forEach(input => localStorage.setItem(input.id, input.value.trim()));
    if (nombreUsuario) nombreUsuario.textContent = localStorage.getItem("usuario");
    if (fotoPerfil) fotoPerfil.src = localStorage.getItem("miAvatar");
    actualizarNavbar();

    const toastEl = document.createElement("div");
    toastEl.classList.add("toast", "position-fixed", "bottom-0", "end-0", "m-3");
    toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Perfil</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">Datos guardados correctamente</div>`;
    document.body.appendChild(toastEl);
    new bootstrap.Toast(toastEl).show();
    setTimeout(() => toastEl.remove(), 3000);
  }

  function deshabilitarCampos() {
    camposPerfil.forEach(input => input.disabled = true);
    if (guardarCambiosBtn) guardarCambiosBtn.classList.add("d-none");
    if (editarPerfilBtn) editarPerfilBtn.classList.remove("d-none");
  }

  function habilitarCampos() {
    camposPerfil.forEach(input => input.disabled = false);
    if (guardarCambiosBtn) guardarCambiosBtn.classList.remove("d-none");
    if (editarPerfilBtn) editarPerfilBtn.classList.add("d-none");
  }

  // Cargar avatar guardado si existe
  try {
    const saved = localStorage.getItem('miAvatar');
    if (saved) fotoPerfil.src = saved;
  } catch (err) {
    console.warn('No se pudo acceder a localStorage:', err);
  }

  // Cargar nombre de usuario
  const username = localStorage.getItem('username');
  if (username) {
    nombreUsuario.innerText = username;
  }

  // Cargar correo electrónico (nuevo)
  const email = localStorage.getItem('email');
  if (correoPerfil && email) {
    correoPerfil.value = email;
  }

  // Inicializar
  deshabilitarCampos();
  cargarDatosPerfil();

  // Eventos
  if (editarPerfilBtn) editarPerfilBtn.addEventListener("click", habilitarCampos);

  if (profileForm) {
    profileForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!guardarCambiosBtn) return;
      guardarCambiosBtn.disabled = true;
      guardarCambiosBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Guardando...`;

      setTimeout(() => {
        guardarDatosPerfil();
        deshabilitarCampos();
        guardarCambiosBtn.disabled = false;
        guardarCambiosBtn.innerHTML = `<i class="bi bi-save me-1"></i> Guardar cambios`;
      }, 1000);
    });
  }

  if (editarFotoBtn && inputFoto && fotoPerfil) {
    editarFotoBtn.addEventListener("click", e => {
      e.preventDefault();
      inputFoto.click();
    });

    inputFoto.addEventListener("change", e => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return alert("Selecciona una imagen válida.");
      if (file.size > 5 * 1024 * 1024) return alert("Imagen demasiado grande. Máx 5MB.");

      const reader = new FileReader();
      reader.onload = ev => {
        fotoPerfil.src = ev.target.result;
        localStorage.setItem("miAvatar", ev.target.result);
        actualizarNavbar();
      };
      reader.readAsDataURL(file);
    });
  }
});
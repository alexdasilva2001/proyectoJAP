document.addEventListener('DOMContentLoaded', () => {
  const editarBtn = document.getElementById('editarFotoBtn') || document.querySelector('.editar-foto');
  const inputFoto = document.getElementById('inputFoto') || document.querySelector('input[type="file"]');
  const fotoPerfil = document.getElementById('fotoPerfil') || document.querySelector('.foto-perfil');

  if (!editarBtn || !inputFoto || !fotoPerfil) {
    console.error('Faltan elementos del perfil en el HTML');
    return;
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
    reader.addEventListener('load', (ev) => {
      fotoPerfil.src = ev.target.result;
      try {
        localStorage.setItem('miAvatar', ev.target.result);
      } catch (err) {
        console.warn('No se pudo guardar avatar en localStorage:', err);
      }
    });
    reader.readAsDataURL(file);
  });

  // Cargar avatar guardado si existe
  try {
    const saved = localStorage.getItem('miAvatar');
    if (saved) fotoPerfil.src = saved;
  } catch (err) {
    console.warn('No se pudo acceder a localStorage:', err);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const editarBtn = document.getElementById('editarFotoBtn') || document.querySelector('.editar-foto');
  const inputFoto = document.getElementById('inputFoto') || document.querySelector('input[type="file"]');
  const fotoPerfil = document.getElementById('fotoPerfil') || document.querySelector('.foto-perfil');
  const nombreUsuario = document.getElementById('nombreUsuario');
  const correoPerfil = document.getElementById('correo'); 

  if (!editarBtn || !inputFoto || !fotoPerfil || !nombreUsuario) {
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

  // Click en el lápiz abre el selector de archivos
  editarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    inputFoto.click();
  });

  // Cuando el usuario elige archivo
  inputFoto.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná una imagen válida.');
      return;
    }

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`La imagen es muy grande. Máximo permitido: ${maxMB} MB.`);
      return;
    }

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
});
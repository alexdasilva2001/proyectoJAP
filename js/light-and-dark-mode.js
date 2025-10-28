let darkMode = localStorage.getItem('darkMode') === 'true' || false;

// Crear botón toggle flotante
const toggleBtn = document.createElement("button");
toggleBtn.id = "toggleBtn";
toggleBtn.setAttribute('aria-label', 'Cambiar modo claro/oscuro');
toggleBtn.style.position = "fixed";
toggleBtn.style.bottom = "20px";
toggleBtn.style.right = "20px";
toggleBtn.style.zIndex = "9999";
toggleBtn.style.width = "60px";
toggleBtn.style.height = "60px";
toggleBtn.style.borderRadius = "50%";
toggleBtn.style.border = "none";
toggleBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
toggleBtn.style.cursor = "pointer";
toggleBtn.style.transition = "all 0.3s ease";
toggleBtn.style.display = "flex";
toggleBtn.style.alignItems = "center";
toggleBtn.style.justifyContent = "center";

// Crear el icono
const icon = document.createElement("i");
icon.classList.add("bi", "bi-moon-fill");
icon.style.fontSize = "24px";
icon.style.transition = "all 0.3s ease";
toggleBtn.appendChild(icon);

// Agregar el botón al body cuando el DOM esté listo
if (document.body) {
  document.body.appendChild(toggleBtn);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(toggleBtn);
  });
}

// Función para activar modo claro
function activarModoClaro() {
  const isLoginPage = window.location.pathname.includes('login.html');
  const html = document.documentElement;
  
  // Cambiar atributo de Bootstrap
  html.setAttribute('data-bs-theme', 'light');
  
  // Colores del body según la página
  if (isLoginPage) {
    document.body.style.background = "linear-gradient(135deg, #642F8C 0%, #4B2A78 100%)";
  } else {
    document.body.style.backgroundColor = "#E1C5F9";
  }
  
  // Estilos del botón
  toggleBtn.style.backgroundColor = "#E1C5F9";
  toggleBtn.style.boxShadow = "0 4px 12px rgba(100, 47, 140, 0.3)";
  icon.className = "bi bi-moon-fill";
  icon.style.color = "#642F8C";
  
  // Ajustar títulos y elementos específicos
  ajustarElementos('light');
  
  // Guardar preferencia
  localStorage.setItem('darkMode', 'false');
  darkMode = false;
}

// Función para activar modo oscuro
function activarModoOscuro() {
  const isLoginPage = window.location.pathname.includes('login.html');
  const html = document.documentElement;
  
  // Cambiar atributo de Bootstrap
  html.setAttribute('data-bs-theme', 'dark');
  
  // Colores del body según la página
  if (isLoginPage) {
    document.body.style.background = "linear-gradient(135deg, #1a0f2e 0%, #2d1b46 100%)";
  } else {
    document.body.style.backgroundColor = "#642F8C";
  }
  
  // Estilos del botón
  toggleBtn.style.backgroundColor = "#a47ad0";
  toggleBtn.style.boxShadow = "0 4px 12px rgba(164, 122, 208, 0.5)";
  icon.className = "bi bi-sun-fill";
  icon.style.color = "#fbbf24";
  
  // Ajustar títulos y elementos específicos
  ajustarElementos('dark');
  
  // Guardar preferencia
  localStorage.setItem('darkMode', 'true');
  darkMode = true;
}

// Función para ajustar elementos específicos
function ajustarElementos(mode) {
  // Título de productos relacionados
  const tituloRelacionados = document.querySelector('.container.py-5 h3');
  if (tituloRelacionados) {
    tituloRelacionados.style.color = mode === 'dark' ? '#f8f4fc' : '#2d1b46';
  }
  
  // Ajustar todos los h1, h2, h3, h4, h5, h6
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    if (!heading.closest('.navbar')) { // Evitar cambiar los del navbar
      heading.style.color = mode === 'dark' ? '#f8f4fc' : '#2d1b46';
    }
  });
  
  // Ajustar jumbotron si existe
  const jumbotron = document.querySelector('.jumbotron');
  if (jumbotron) {
    if (mode === 'dark') {
      jumbotron.style.background = "linear-gradient(135deg, rgba(26, 15, 46, 0.9) 0%, rgba(45, 27, 70, 0.9) 100%), url('../img/cover_back.png')";
    } else {
      jumbotron.style.background = "linear-gradient(135deg, rgba(100, 47, 140, 0.9) 0%, rgba(75, 42, 120, 0.9) 100%), url('../img/cover_back.png')";
    }
    jumbotron.style.backgroundSize = "cover";
    jumbotron.style.backgroundPosition = "center";
  }
}

// Efecto hover para el botón
toggleBtn.addEventListener('mouseenter', () => {
  toggleBtn.style.transform = "scale(1.1) rotate(10deg)";
});

toggleBtn.addEventListener('mouseleave', () => {
  toggleBtn.style.transform = "scale(1) rotate(0deg)";
});

// Evento click
toggleBtn.addEventListener("click", () => {
  if (darkMode) {
    activarModoClaro();
  } else {
    activarModoOscuro();
  }
});

// Inicializar según la preferencia guardada
if (darkMode) {
  activarModoOscuro();
} else {
  activarModoClaro();
}

// Detectar cambios de preferencia del sistema (opcional)
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Solo aplicar si no hay preferencia guardada
  if (localStorage.getItem('darkMode') === null) {
    if (mediaQuery.matches) {
      activarModoOscuro();
    } else {
      activarModoClaro();
    }
  }
  
  // Escuchar cambios en la preferencia del sistema
  mediaQuery.addEventListener('change', (e) => {
    // Solo aplicar si el usuario no ha establecido una preferencia manual
    if (localStorage.getItem('darkMode') === null) {
      if (e.matches) {
        activarModoOscuro();
      } else {
        activarModoClaro();
      }
    }
  });
}

// Transición suave al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
});
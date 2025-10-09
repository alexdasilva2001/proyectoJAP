let darkMode = false;

// Crear botón toggle flotante
const toggleBtn = document.createElement("button");
toggleBtn.id = "toggleBtn";
toggleBtn.style.position = "fixed";
toggleBtn.style.bottom = "20px";
toggleBtn.style.right = "20px";
toggleBtn.style.zIndex = "9999";
toggleBtn.style.width = "60px";
toggleBtn.style.height = "60px";
toggleBtn.style.borderRadius = "50%";
toggleBtn.style.border = "none";
toggleBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
toggleBtn.style.cursor = "pointer";
toggleBtn.style.transition = "all 0.3s ease";
toggleBtn.style.display = "flex";
toggleBtn.style.alignItems = "center";
toggleBtn.style.justifyContent = "center";

// Crear el icono
const icon = document.createElement("i");
icon.classList.add("bi", "bi-moon-fill");
icon.style.fontSize = "24px";
toggleBtn.appendChild(icon);

// Agregar el botón al body
document.body.appendChild(toggleBtn);

// Funciones de activación de modos
function activarModoClaro() {
    // Detectar si estamos en la página de login
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (isLoginPage) {
        document.body.style.backgroundColor = "#A5A6F6";
    } else {
        document.body.style.backgroundColor = "#E1C5F9";
    }
    
    document.body.style.color = "black";
    toggleBtn.style.backgroundColor = "#E1C5F9";
    icon.className = "bi bi-moon-fill";
    icon.style.color = "#642F8C";
    
    // Ajustar el color del título de productos relacionados
    const tituloRelacionados = document.querySelector('.container.py-5 h3');
    if (tituloRelacionados) {
        tituloRelacionados.style.color = "black";
    }
    
    // Efecto hover para modo claro
    toggleBtn.onmouseover = () => {
        toggleBtn.style.transform = "scale(1.1)";
    };
    toggleBtn.onmouseout = () => {
        toggleBtn.style.transform = "scale(1)";
    };
}

function activarModoOscuro() {
    // Detectar si estamos en la página de login
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (isLoginPage) {
        document.body.style.backgroundColor = "#122883";
    } else {
        document.body.style.backgroundColor = "#642F8C";
    }
    
    document.body.style.color = "black";
    toggleBtn.style.backgroundColor = "#a47ad0";
    icon.className = "bi bi-sun-fill";
    icon.style.color = "yellow";
    
    // Ajustar el color del título de productos relacionados
    const tituloRelacionados = document.querySelector('.container.py-5 h3');
    if (tituloRelacionados) {
        tituloRelacionados.style.color = "white";
    }
    
    // Efecto hover para modo oscuro
    toggleBtn.onmouseover = () => {
        toggleBtn.style.transform = "scale(1.1)";
    };
    toggleBtn.onmouseout = () => {
        toggleBtn.style.transform = "scale(1)";
    };
}

// Evento click
toggleBtn.addEventListener("click", () => {
    darkMode = !darkMode;
    if (darkMode) {
        activarModoOscuro();
    } else {
        activarModoClaro();
    }
});

// Inicializar
activarModoClaro();
function login(){
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (username === "" || password === "") {
        alert("Completa ambos campos.");
        return;
    }
    alert("Bienvenido, " + username + "!");
}
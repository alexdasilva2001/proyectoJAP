(async () => {
  try {
    // Usar fetch global de Node 18+. Si no existe, el script fallará.
    const loginRes = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'usuario1', password: 'pass1234' })
    });

    const loginJson = await loginRes.json();
    console.log('--- /login status:', loginRes.status, '---');
    console.log(JSON.stringify(loginJson, null, 2));

    if (!loginJson.token) {
      console.error('No se recibió token. Abortando pruebas protegidas.');
      process.exit(1);
    }

    const token = loginJson.token;

    const protRes = await fetch('http://localhost:3000/api/protegida', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    const protJson = await protRes.json();
    console.log('--- /api/protegida status:', protRes.status, '---');
    console.log(JSON.stringify(protJson, null, 2));
  } catch (err) {
    console.error('Error en pruebas HTTP:', err);
    process.exit(1);
  }
})();

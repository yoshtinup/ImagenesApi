const createServer = require('./src/infrastructure/config/server');

const PORT = process.env.PORT || 3000;

// Crear e iniciar el servidor
const app = createServer();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // <-- Importa cors

const app = express();
const PORT = 3000;

// Configura CORS para permitir todas las solicitudes
app.use(cors());  // <-- Añade cors como middleware

// Configuración de Multer para la subida de archivos
const UPLOAD_FOLDER = './uploads';
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Solo se permiten imágenes (jpeg, jpg, png, gif)');
        }
    }
});

// Ruta para subir una imagen
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo o el archivo no es una imagen válida' });
    }
    res.status(201).json({ message: 'Imagen subida exitosamente', filename: req.file.filename });
});

// Ruta para obtener una imagen por su nombre de archivo
app.get('/image/:filename', (req, res) => {
    const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { root: '.' });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

// Ruta para listar todas las imágenes
app.get('/images', (req, res) => {
    fs.readdir(UPLOAD_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el directorio' });
        }
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(images);
    });
});

// Ruta para eliminar una imagen por su nombre de archivo
app.delete('/image/:filename', (req, res) => {
    const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el archivo' });
            }
            res.status(200).json({ message: 'Archivo eliminado exitosamente' });
        });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

// Ruta para actualizar una imagen por su nombre de archivo
app.put('/image/:filename', upload.single('image'), (req, res) => {
    const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo o el archivo no es una imagen válida' });
    }
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el archivo anterior' });
            }
            res.status(200).json({ message: 'Imagen actualizada exitosamente', filename: req.file.filename });
        });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado para actualizar' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
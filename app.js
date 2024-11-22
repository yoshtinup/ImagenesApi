const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configura CORS para permitir todas las solicitudes
app.use(cors());

// Carpeta para guardar las imágenes subidas
const UPLOAD_FOLDER = './uploads';
const PHOTOS_FOLDER = path.join(UPLOAD_FOLDER, 'photos');
const QR_FOLDER = path.join(UPLOAD_FOLDER, 'qr');

// Crea las carpetas si no existen
[UPLOAD_FOLDER, PHOTOS_FOLDER, QR_FOLDER].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Decide la carpeta de destino según la ruta
        const folder = req.originalUrl.includes('/save-qr') ? QR_FOLDER : PHOTOS_FOLDER;
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Configuración de Multer para subida de archivos
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb('Error: Solo se permiten imágenes (jpeg, jpg, png, gif)');
        }
    }
});

// Ruta para guardar una foto
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo o el archivo no es válido' });
    }
    res.status(201).json({ message: 'Foto subida exitosamente', filename: req.file.filename });
});

// Ruta para guardar un archivo QR enviado desde Flutter
app.post('/save-qr', upload.single('qr'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo o el archivo no es válido' });
    }
    res.status(201).json({
        message: 'Código QR guardado exitosamente',
        filename: req.file.filename,
    });
});

// Ruta para listar fotos
app.get('/images', (req, res) => {
    fs.readdir(PHOTOS_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el directorio de fotos' });
        }
        const photos = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(photos);
    });
});

// Ruta para listar códigos QR
app.get('/qrs', (req, res) => {
    fs.readdir(QR_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el directorio de códigos QR' });
        }
        const qrs = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(qrs);
    });
});

// Ruta para obtener una imagen por su nombre de archivo (de cualquier carpeta)
app.get('/image/:filename', (req, res) => {
    const filePathPhoto = path.join(PHOTOS_FOLDER, req.params.filename);
    const filePathQR = path.join(QR_FOLDER, req.params.filename);

    if (fs.existsSync(filePathPhoto)) {
        res.sendFile(filePathPhoto, { root: '.' });
    } else if (fs.existsSync(filePathQR)) {
        res.sendFile(filePathQR, { root: '.' });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

// Ruta para eliminar una imagen por su nombre de archivo (de cualquier carpeta)
app.delete('/image/:filename', (req, res) => {
    const filePathPhoto = path.join(PHOTOS_FOLDER, req.params.filename);
    const filePathQR = path.join(QR_FOLDER, req.params.filename);

    if (fs.existsSync(filePathPhoto)) {
        fs.unlink(filePathPhoto, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el archivo de fotos' });
            }
            res.status(200).json({ message: 'Archivo eliminado exitosamente de fotos' });
        });
    } else if (fs.existsSync(filePathQR)) {
        fs.unlink(filePathQR, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el archivo de QR' });
            }
            res.status(200).json({ message: 'Archivo eliminado exitosamente de QR' });
        });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

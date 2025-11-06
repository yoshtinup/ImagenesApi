const multer = require('multer');
const path = require('path');

const UPLOAD_FOLDER = './uploads';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
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
        console.log('--- Información del archivo recibido ---');
        console.log('Nombre del archivo:', file.originalname);
        console.log('Extensión del archivo:', path.extname(file.originalname).toLowerCase());
        console.log('Tipo MIME del archivo:', file.mimetype);

        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
            // Permitir el archivo, ignorando la validación MIME por problemas de detección incorrecta
            cb(null, true);
        } else {
            console.error('Error: Solo se permiten imágenes (jpeg, jpg, png, gif)');
            cb('Error: Solo se permiten imágenes (jpeg, jpg, png, gif)');
        }
    }
});

module.exports = { upload, UPLOAD_FOLDER };

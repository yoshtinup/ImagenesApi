const express = require('express');
const { upload } = require('../../config/multer.config');

function createImageRoutes(imageController) {
    const router = express.Router();

    // Ruta para subir una imagen
    router.post('/upload', upload.single('image'), (req, res) => {
        imageController.uploadImage(req, res);
    });

    // Ruta para obtener una imagen por su nombre de archivo
    router.get('/image/:filename', (req, res) => {
        imageController.getImage(req, res);
    });

    // Ruta para listar todas las imágenes
    router.get('/images', (req, res) => {
        imageController.listImages(req, res);
    });

    // Ruta para eliminar una imagen por su nombre de archivo
    router.delete('/image/:filename', (req, res) => {
        imageController.deleteImage(req, res);
    });

    // Ruta para actualizar una imagen por su nombre de archivo
    router.put('/image/:filename', upload.single('image'), (req, res) => {
        imageController.updateImage(req, res);
    });

    return router;
}

module.exports = createImageRoutes;

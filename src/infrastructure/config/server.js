const express = require('express');
const cors = require('cors');

// Importar dependencias de la capa de infraestructura
const FileSystemImageRepository = require('../adapters/repositories/FileSystemImageRepository');
const { UPLOAD_FOLDER } = require('./multer.config');

// Importar casos de uso de la capa de aplicación
const UploadImageUseCase = require('../../application/use-cases/UploadImageUseCase');
const GetImageUseCase = require('../../application/use-cases/GetImageUseCase');
const ListImagesUseCase = require('../../application/use-cases/ListImagesUseCase');
const DeleteImageUseCase = require('../../application/use-cases/DeleteImageUseCase');
const UpdateImageUseCase = require('../../application/use-cases/UpdateImageUseCase');

// Importar controlador y rutas
const ImageController = require('../adapters/controllers/ImageController');
const createImageRoutes = require('../adapters/routes/image.routes');

function createServer() {
    const app = express();

    // Configurar CORS
    app.use(cors());

    // Middleware para parsear JSON
    app.use(express.json());

    // Inyección de dependencias
    const imageRepository = new FileSystemImageRepository(UPLOAD_FOLDER);

    const uploadImageUseCase = new UploadImageUseCase(imageRepository);
    const getImageUseCase = new GetImageUseCase(imageRepository);
    const listImagesUseCase = new ListImagesUseCase(imageRepository);
    const deleteImageUseCase = new DeleteImageUseCase(imageRepository);
    const updateImageUseCase = new UpdateImageUseCase(imageRepository);

    const imageController = new ImageController(
        uploadImageUseCase,
        getImageUseCase,
        listImagesUseCase,
        deleteImageUseCase,
        updateImageUseCase
    );

    // Configurar rutas
    const imageRoutes = createImageRoutes(imageController);
    app.use('/', imageRoutes);

    return app;
}

module.exports = createServer;

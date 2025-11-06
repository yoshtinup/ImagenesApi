class ImageController {
    constructor(
        uploadImageUseCase,
        getImageUseCase,
        listImagesUseCase,
        deleteImageUseCase,
        updateImageUseCase
    ) {
        this.uploadImageUseCase = uploadImageUseCase;
        this.getImageUseCase = getImageUseCase;
        this.listImagesUseCase = listImagesUseCase;
        this.deleteImageUseCase = deleteImageUseCase;
        this.updateImageUseCase = updateImageUseCase;
    }

    async uploadImage(req, res) {
        try {
            const image = await this.uploadImageUseCase.execute(req.file);
            res.status(201).json({
                message: 'Imagen subida exitosamente',
                filename: image.filename
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getImage(req, res) {
        try {
            const imagePath = await this.getImageUseCase.execute(req.params.filename);
            res.sendFile(imagePath);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async listImages(req, res) {
        try {
            const images = await this.listImagesUseCase.execute();
            res.json(images);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteImage(req, res) {
        try {
            const result = await this.deleteImageUseCase.execute(req.params.filename);
            res.status(200).json(result);
        } catch (error) {
            const statusCode = error.message === 'Archivo no encontrado' ? 404 : 500;
            res.status(statusCode).json({ error: error.message });
        }
    }

    async updateImage(req, res) {
        try {
            const image = await this.updateImageUseCase.execute(
                req.params.filename,
                req.file
            );
            res.status(200).json({
                message: 'Imagen actualizada exitosamente',
                filename: image.filename
            });
        } catch (error) {
            const statusCode = error.message === 'Archivo no encontrado para actualizar' ? 404 : 400;
            res.status(statusCode).json({ error: error.message });
        }
    }
}

module.exports = ImageController;

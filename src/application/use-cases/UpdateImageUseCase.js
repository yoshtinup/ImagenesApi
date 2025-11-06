const Image = require('../../domain/entities/Image');

class UpdateImageUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }

    async execute(oldFilename, newImageFile) {
        if (!newImageFile) {
            throw new Error('No se ha proporcionado ningún archivo');
        }

        const exists = await this.imageRepository.exists(oldFilename);
        if (!exists) {
            throw new Error('Archivo no encontrado para actualizar');
        }

        const image = new Image({
            filename: newImageFile.filename,
            originalname: newImageFile.originalname,
            mimetype: newImageFile.mimetype,
            size: newImageFile.size
        });

        if (!image.isValidExtension()) {
            throw new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)');
        }

        await this.imageRepository.update(oldFilename, newImageFile);
        return image;
    }
}

module.exports = UpdateImageUseCase;

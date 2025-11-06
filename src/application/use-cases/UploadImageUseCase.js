const Image = require('../../domain/entities/Image');

class UploadImageUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }

    async execute(imageFile) {
        if (!imageFile) {
            throw new Error('No se ha proporcionado ningún archivo');
        }

        const image = new Image({
            filename: imageFile.filename,
            originalname: imageFile.originalname,
            mimetype: imageFile.mimetype,
            size: imageFile.size
        });

        if (!image.isValidExtension()) {
            throw new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)');
        }

        await this.imageRepository.save(imageFile);
        return image;
    }
}

module.exports = UploadImageUseCase;

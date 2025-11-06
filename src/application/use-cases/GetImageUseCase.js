class GetImageUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }

    async execute(filename) {
        const imagePath = await this.imageRepository.findByFilename(filename);
        
        if (!imagePath) {
            throw new Error('Archivo no encontrado');
        }

        return imagePath;
    }
}

module.exports = GetImageUseCase;

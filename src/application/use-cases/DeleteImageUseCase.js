class DeleteImageUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }

    async execute(filename) {
        const exists = await this.imageRepository.exists(filename);
        
        if (!exists) {
            throw new Error('Archivo no encontrado');
        }

        await this.imageRepository.delete(filename);
        return { message: 'Archivo eliminado exitosamente' };
    }
}

module.exports = DeleteImageUseCase;

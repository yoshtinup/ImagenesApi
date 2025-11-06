class ListImagesUseCase {
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }

    async execute() {
        const images = await this.imageRepository.findAll();
        return images;
    }
}

module.exports = ListImagesUseCase;

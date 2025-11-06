/**
 * Puerto de salida (Interface) para el repositorio de imágenes
 * Define el contrato que debe cumplir cualquier implementación del repositorio
 */
class ImageRepository {
    async save(imageFile) {
        throw new Error('Method save() must be implemented');
    }

    async findByFilename(filename) {
        throw new Error('Method findByFilename() must be implemented');
    }

    async findAll() {
        throw new Error('Method findAll() must be implemented');
    }

    async delete(filename) {
        throw new Error('Method delete() must be implemented');
    }

    async update(oldFilename, newImageFile) {
        throw new Error('Method update() must be implemented');
    }

    async exists(filename) {
        throw new Error('Method exists() must be implemented');
    }
}

module.exports = ImageRepository;

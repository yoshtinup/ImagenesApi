const ImageRepository = require('../../../domain/ports/ImageRepository');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

class FileSystemImageRepository extends ImageRepository {
    constructor(uploadFolder = './uploads') {
        super();
        this.uploadFolder = uploadFolder;
        this._ensureUploadFolderExists();
    }

    _ensureUploadFolderExists() {
        if (!fs.existsSync(this.uploadFolder)) {
            fs.mkdirSync(this.uploadFolder, { recursive: true });
        }
    }

    async save(imageFile) {
        // El archivo ya fue guardado por Multer, solo retornamos la información
        return {
            filename: imageFile.filename,
            path: path.join(this.uploadFolder, imageFile.filename)
        };
    }

    async findByFilename(filename) {
        const filePath = path.join(this.uploadFolder, filename);
        const exists = fs.existsSync(filePath);
        
        if (!exists) {
            return null;
        }

        return path.resolve(filePath);
    }

    async findAll() {
        try {
            const files = await readdir(this.uploadFolder);
            const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            return images;
        } catch (error) {
            throw new Error('Error al leer el directorio de imágenes');
        }
    }

    async delete(filename) {
        const filePath = path.join(this.uploadFolder, filename);
        
        try {
            await unlink(filePath);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el archivo');
        }
    }

    async update(oldFilename, newImageFile) {
        const oldFilePath = path.join(this.uploadFolder, oldFilename);
        
        try {
            // Eliminar el archivo antiguo
            await unlink(oldFilePath);
            // El nuevo archivo ya fue guardado por Multer
            return {
                filename: newImageFile.filename,
                path: path.join(this.uploadFolder, newImageFile.filename)
            };
        } catch (error) {
            throw new Error('Error al actualizar el archivo');
        }
    }

    async exists(filename) {
        const filePath = path.join(this.uploadFolder, filename);
        return fs.existsSync(filePath);
    }
}

module.exports = FileSystemImageRepository;

class Image {
    constructor({ filename, originalname, mimetype, size, uploadedAt }) {
        this.filename = filename;
        this.originalname = originalname;
        this.mimetype = mimetype;
        this.size = size;
        this.uploadedAt = uploadedAt || new Date();
    }

    isValidExtension() {
        const validExtensions = /\.(jpg|jpeg|png|gif)$/i;
        return validExtensions.test(this.filename);
    }
}

module.exports = Image;

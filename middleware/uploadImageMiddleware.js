const multer = require('multer');

const AppError = require('../utils/AppError');

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new AppError('Only images are allowed', 400), false);
        }
    }
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
}
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName)


exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields)

const multer = require('multer');

const AppError = require('../utils/AppError');


exports.uploadSingleImage = (fieldName) => {
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new AppError('Only images are allowed', 400), false);
        }
    }
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload.single(fieldName)

}
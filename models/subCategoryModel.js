const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        minlength: [2, 'Too short subCategory name'],
        maxlength: [32, 'Too long subCategory name'],
        required: [true, 'SubCategory required'],
        unique: [true, 'SubCategory must be unique'],
    },
    slug: {
        type: String,
        lowercase: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must be belong to a Category']
    }

},
    { timestamps: true });

subCategorySchema.pre(/^find/, function () {
    this.populate({ path: 'category', select: 'name -_id' })
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Category required'],
    unique: [true, 'Category must be unique'],
    minlength: [3, 'Too short category name'],
    maxlength: [32, 'Too long category name'],
  },
  // A and B => shoping.com/a-and-b
  slug: {
    type: String,
    lowercase: true,
  },
  image: String,
},
  { timestamps: true }
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageURL
  }
}

categorySchema.post('init', (doc) => {
  setImageUrl(doc)
})
categorySchema.post('save', (doc) => {
  setImageUrl(doc)
})

module.exports = mongoose.model('Category', categorySchema);

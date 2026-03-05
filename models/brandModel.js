const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Brand required'],
    unique: [true, 'Brand must be unique'],
    minlength: [3, 'Too short brand name'],
    maxlength: [32, 'Too long brand name'],
  },
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
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`
    doc.image = imageURL
  }
}

brandSchema.post('init', (doc) => {
  setImageUrl(doc)
})
brandSchema.post('save', (doc) => {
  setImageUrl(doc)
})

module.exports = mongoose.model('Brand', brandSchema);

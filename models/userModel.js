const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userRoles = require('../utils/authorization/userRoles');
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [32, 'Name must be at most 32 characters'],
        required: [true, 'Name is required'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: String
    },
    profileImage: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String, // ["USER", "ADMIN", "MANAGER"]
        enum: [
            userRoles.USER,
            userRoles.ADMIN,
            userRoles.MANAGER
        ],
        default: userRoles.USER
    },
    active: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: Date,

    passwordResetCode: String,
    passwordResetCodeExpire: Date,

    passwordResetVerified: Boolean,
},
    { timestamps: true }

);
const setImageUrl = (doc) => {
    if (doc.profileImage) {
        const imageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`
        doc.profileImage = imageURL
    }
}

userSchema.post('init', (doc) => {
    setImageUrl(doc)
})
userSchema.post('save', (doc) => {
    setImageUrl(doc)
})
userSchema.pre('save', async function () {

    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
})

module.exports = mongoose.model('User', userSchema);                
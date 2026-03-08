const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    uploadUserImage,
    resizeImage
} = require('../services/userService');

const { getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } = require('../utils/validators/userValidator');



router.put('/changepassword/:id', changeUserPasswordValidator, updateUserPassword)


router.route('/')
    .get(getUsers)
    .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
    .get(getUserValidator, getUserById)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);



module.exports = router;
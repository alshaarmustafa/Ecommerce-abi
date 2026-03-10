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

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator
} = require('../utils/validators/userValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');



router.put('/changepassword/:id', changeUserPasswordValidator, updateUserPassword)


router.route('/')

    .get(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        getUsers
    )

    .post(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );

router.route('/:id')

    .get(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        getUserValidator,
        getUserById
    )

    .put(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser
    )

    .delete(
        protect,
        allowedTo(userRoles.ADMIN),
        deleteUserValidator,
        deleteUser
    );



module.exports = router;
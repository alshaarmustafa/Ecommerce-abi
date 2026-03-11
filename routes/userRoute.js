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
    resizeImage,
   
} = require('../services/userService');
const {
    getloggedUserData,
    updateLoggedUserData,
    deleteLoggedUserData,
    UpdateLoggedUserPassword,
    activateLoggedUserData
} = require('../services/loggedUser')

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserDataValidator
} = require('../utils/validators/userValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');



router.put('/changepassword', changeUserPasswordValidator, updateUserPassword);

router.use(protect)

// logged User Data
router.get('/getMe', getloggedUserData, getUserById)

router.put('/changeMyPassword', UpdateLoggedUserPassword)

router.put('/changeMydata', updateLoggedUserDataValidator, updateLoggedUserData)

router.delete('/deleteMe', deleteLoggedUserData)

router.put('/activateMe',activateLoggedUserData )



// Admin & Manager
router.route('/')

    .get(
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        getUsers
    )

    .post(
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );

router.route('/:id')

    .get(
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        getUserValidator,
        getUserById
    )

    .put(
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser
    )

    .delete(
        allowedTo(userRoles.ADMIN),
        deleteUserValidator,
        deleteUser
    );



module.exports = router;
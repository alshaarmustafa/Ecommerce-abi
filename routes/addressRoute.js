const express = require('express');
const router = express.Router();
const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
    updateUserAddress

} = require('../services/addressService');

const {
    addAddressValidator,
    updateAddressValidator,
    removeAddressValidator
} = require('../utils/validators/addressValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');




router.use(protect, allowedTo(userRoles.USER))


router.route('/')
    .post(addAddressValidator, addAddress)
    .get(getLoggedUserAddresses)

router.route('/:addressId')
    .delete(removeAddressValidator, removeAddress)
    .put(updateAddressValidator, updateUserAddress)



module.exports = router;
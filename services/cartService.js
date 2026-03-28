const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');


const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount=undefined;
    return totalPrice
}

// @desc    Add Prouct to cart
// @route   POST /api/cart
// @access  Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    //1-Get Cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        //Create new cart for logged user
        cart = await Cart.create({
            user: req.user._id, cartItems: [
                {
                    product: productId,
                    color,
                    price: product.price
                },
            ]
        });
    } else {
        //product exist in cart , update quantity
        //findIndex return index of item and if item not found return -1
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        )
        if (productIndex > -1) {
            cart.cartItems[productIndex].quantity += 1;
        } else {
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price
            });
        }
    }
    calcTotalCartPrice(cart)
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Get logged user cart
// @route   GET /api/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new AppError(`there is no cart for this user : ${req.user._id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
})

// @desc   Remove specific cart item
// @route   DELETE /api/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        { returnDocument: 'after' });
    if (!cart) {
        return next(new AppError(`there is no cart for this user : ${req.user._id}`, 404));
    }
    calcTotalCartPrice(cart)
    await cart.save();
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });

})

// @desc   clear logged user cart 
// @route   DELETE /api/cart
// @access  Private/User
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
        return next(new AppError(`there is no cart for this user : ${req.user._id}`, 404));
    }
    res.status(204).json({
        status: 'success'
    });
})

// @desc   update specific cart item quantity for logged user cart 
// @route   PUT /api/cart/itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new AppError(`there is no cart for this user : ${req.user._id}`, 404));
    }
    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    )
    if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity = quantity;
    }
    calcTotalCartPrice(cart)
    await cart.save();
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });


})

// @desc   Apply Coupon on logged user cart 
// @route   PUT /api/cart/applyCoupon
// @access  Private/User
exports.applyCoupon=asyncHandler(async(req,res,next)=>{
    //1)get coupon based on coupon name 
    const coupon=await Coupon.findOne({name:req.body.couponName,
        expire:{$gt:Date.now()}})
    if(!coupon){
        return next(new AppError('Coupon is invalid or expired',404))
    }
    //2)get logged usercart to get total price 
    const cart = await Cart.findOne({ user: req.user._id });
    totalPrice = cart.totalCartPrice;

    //3)calculate discount price 
    cart.totalPriceAfterDiscount=
   (totalPrice-(totalPrice*coupon.discount)/100).toFixed(2);
    await cart.save();
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
        
    })
    })

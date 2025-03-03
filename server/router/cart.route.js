const { Router } = require("express");
const auth = require("../middleware/auth.js");
const { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } = require("../controllers/cart.controller.js");

const cartRouter = Router()

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get("/get",auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemQtyController)

module.exports= cartRouter
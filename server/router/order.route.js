const { Router } = require('express')
const auth = require('../middleware/auth.js')
const { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } = require('../controllers/order.controller.js')

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)

module.exports= orderRouter
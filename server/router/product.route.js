const  {createProductController, getProductController, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails, updateProductDetails, deleteProductDetails, searchProduct} =  require("../controllers/product.controller");
const admin  = require("../middleware/Admin");
const auth =require("../middleware/auth");

const Router  = require("express");


const productRouter = Router()
productRouter.post("/create",auth,createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-pruduct-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.put('/update-product-details',auth,admin,updateProductDetails)
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)
productRouter.post('/search-product',searchProduct)
module.exports = productRouter
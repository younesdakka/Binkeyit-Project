const { deleteSubCategoryController, getSubCategoryController, updateSubCategoryController, AddSubCategoryController } = require("../controllers/subCategory.controller");

const { Router }= require("express");
const auth= require("../middleware/auth");


const subCategoryRouter= Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)
subCategoryRouter.get('/get',auth,getSubCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)
subCategoryRouter.delete('/delete',auth,deleteSubCategoryController)

module.exports = subCategoryRouter
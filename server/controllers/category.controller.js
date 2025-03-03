const CategoryModel = require("../models/category.model")
const ProductModel = require("../models/product.model")
const SubCategoryModel = require("../models/subCategory.model")


 const AddCategoryController = async (req,res)=>{
    try {
        const {name , image} = req.body
        if (!name || !image) {
            return res.json({
                message:"Enter required fields",
                error:true,
                success:false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })
        const saveCategory = addCategory.save()
        if (!saveCategory) {
            return res.status(500).json({
                message:"Not created",
                success:false,
                error:true
            })
        }
        return res.json({
            message : "Add category",
            data:saveCategory,
            success:true,
            error:false
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
    }

}
/////////////////////////////////////////////////////////////////////
const getCategoryController = async(req,res)=>{
    try {
        
        const data = await CategoryModel.find().sort({ createdAt : -1 })

        return res.json({
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.messsage || error,
            error : true,
            success : false
        })
    }
}
/////////////////////////////////////////////////////////////////////
 const updateCategoryController = async(req,res)=>{
    try {
        const { _id ,name, image } = req.body 

        const update = await CategoryModel.updateOne({
            _id : _id
        },{
           name, 
           image 
        })

        return res.json({
            message : "Updated Category",
            success : true,
            error : false,
            data : update
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
/////////////////////////////////////////////////////////////////////
const deleteCategoryController = async(req,res)=>{
    try {
        const { _id } = req.body 

        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSubCategory >  0 || checkProduct > 0 ){
            return res.status(400).json({
                message : "Category is already use can't delete",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id : _id})

        return res.json({
            message : "Delete category successfully",
            data : deleteCategory,
            error : false,
            success : true
        })

    } catch (error) {
       return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
       }) 
    }
}

module.exports = { AddCategoryController,getCategoryController,updateCategoryController, deleteCategoryController};
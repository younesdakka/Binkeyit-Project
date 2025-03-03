const AddressModel = require("../models/address.model.js");
const UserModel = require("../models/user.model.js"); 
const addAddressController = async(req,res)=>{
    try {
        const userId = req.userId
        const { address_line , city, state, pincode, country,mobile } = req.body

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile,
            userId : userId 
        })
        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push : {
                address_details : saveAddress._id
            }
        })

        return res.json({
            message : "Address Created Successfully",
            error : false,
            success : true,
            data : saveAddress
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
const getAddressController = async(req,res)=>{
    try {
        const userId = req.userId 

        const data = await AddressModel.find({ userId : userId }).sort({ createdAt : -1})

        return res.json({
            data : data,
            message : "List of address",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}
const updateAddressController = async(req,res)=>{
    try {
        const userId = req.userId
        const { _id, address_line,city,state,country,pincode, mobile } = req.body 

        const updateAddress = await AddressModel.updateOne({ _id : _id, userId : userId },{
            address_line,
            city,
            state,
            country,
            mobile,
            pincode
        })

        return res.json({
            message : "Address Updated",
            error : false,
            success : true,
            data : updateAddress
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

const deleteAddresscontroller = async(req,res)=>{
    try {
        const userId = req.userId 
        const { _id } = req.body 

        const disableAddress = await AddressModel.updateOne({ _id : _id, userId},{
            status : false
        })

        return res.json({
            message : "Address remove",
            error : false,
            success : true,
            data : disableAddress
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
module.exports = {addAddressController,getAddressController,updateAddressController,deleteAddresscontroller}
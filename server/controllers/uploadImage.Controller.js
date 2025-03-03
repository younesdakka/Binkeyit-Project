const uploadImageClodinary = require("../utils/uploadImageClodinary")


const uploadImageController = async(request,response)=>{
    try {
        const file = request.file

        const uploadImage = await uploadImageClodinary(file)

        return response.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

module.exports = uploadImageController
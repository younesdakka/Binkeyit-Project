const { Router } = require("express")
const auth = require("../middleware/auth")
const uploadImageController = require("../controllers/uploadImage.Controller")
const upload = require('../middleware/multer.js')

const uploadRouter =Router()

uploadRouter.post("/upload",auth,upload.single("image"),uploadImageController)

module.exports = uploadRouter


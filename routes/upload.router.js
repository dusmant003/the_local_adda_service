const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleWares/uploadMiddleware');


router.post('/fileUpload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: " no file uploaded",
                success: false
            })
        }
        return res.status(200).json({
            message: "file uploaded successfully",
            success: true
        })
    } catch (error) {
        console.error("file upload error:", error.message);
        return res.status(500).json({
            message: "file upload error",
            success: false
        })

    }

})






module.exports = router;
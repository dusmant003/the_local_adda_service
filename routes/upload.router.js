const express = require('express');
const router = express.Router();

const { upload } = require('../middleWares/uploadMiddleware');

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

    }

})






module.exports = router;
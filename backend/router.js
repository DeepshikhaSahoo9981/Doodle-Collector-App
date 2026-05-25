const express = require("express");
router = express.Router();
const generator = require("./controllers/doodleTopicGenerator");
const uploadToDriveMain = require("./controllers/imageUploadController");
// 1. Import the multer package
const multer = require("multer"); 
const { readAllFiles } = require("./controllers/albumReaderController");

// 2. Initialize the 'upload' middleware instance
const upload = multer({ dest: 'uploads/' });

router.get("/generate", async(req,res)=>{
    try{
        return await generator(req,res);
    }catch(err){
        res.status(500).send("Server error", err);
    }
})

router.post("/uploadImage",upload.single('doodle_image'), uploadToDriveMain);
router.get("/readAllImage", readAllFiles);


module.exports = router;
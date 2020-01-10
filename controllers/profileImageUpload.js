const express=require('express');
const multer=require('multer');
const path=require('path');

const profileImageStorage=multer.diskStorage({
    destination:"./public/proImage",
    filename:(req,file,callback)=>{
        let extension=path.extname(file.originalname);
        callback(null,`${file.fieldname}-${Date.now()}${extension}`);
    }
});

const imageValidation=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error("Images can only be uploaded!!!"),false)
    }
    cb(null,true);
};

const upload=multer({
    storage:profileImageStorage,
    fileFilter:imageValidation
})

const uploadRoute=express.Router();
uploadRoute.route('/')
.post(upload.single('proImage'),(req,res)=>{
    res.json(req.file);
});

module.exports=uploadRoute;
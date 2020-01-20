const express=require('express');
const route=express.Router();
const Post=require('../models/posts');
const auth=require('../auth/authentication');

route.post('/add',auth.verifyUser,(req,res,next)=>{
    console.log(req.user._id)
    Post.create({
        caption:req.body.caption,
        images:req.body.images,
        user_id:req.user._id
    }).then((post)=>{
        res.json(post)
    }).catch(next)
})

module.exports=route;
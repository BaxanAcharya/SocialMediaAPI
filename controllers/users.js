const express=require('express');
const bcrypt=require('bcryptjs');
const jwttoken=require('jsonwebtoken');
const User=require('../models/users');
const route=express.Router();


route.post('/register',(req,res,next) =>{
    let password=req.body.password;
    bcrypt.hash(password,10,function(err,hash){
        if(err){
            let err=new Error('Error during hashing');
            err.status=500;
            return next(err);
        }
        User.create({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            emailPhone:req.body.emailPhone,
            username:req.body.username,
            password:hash,
            image:req.body.image,
            dob:req.body.dob
        }).then((user) =>{
            let token=jwttoken.sign({_id:user._id}, process.env.SECRET);
            res.json({status:"Registered!!!!",token:token});
        }).catch(next);
    });
});


route.post('/login',(req,res,next)=>{
    User.findOne({emailPhone:req.body.emailPhone})
    .then((user)=>{
        if(user==null)
        {
            let err=new Error('User not registered');
            err.status=401;
            return next(err);
        }else if(user.verify==false)
        {
            let err=new Error('Please verify your account');
            err.status=401;
            return next(err);
        }
        else{
            bcrypt.compare(req.body.password,user.password)
            .then((isMatch)=>{
                if(!isMatch){
                    let err=new Error('Password not valid');
                    err.status=401;
                    return next(err);
                }
                let token=jwttoken.sign({_id: user._id}, process.env.SECRET);
                res.json({status:'You have logged!!!', token:token});
            }).catch(next);
        }
    }).catch(next);
});

module.exports = route;
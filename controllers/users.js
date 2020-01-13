const express=require('express');
const bcrypt=require('bcryptjs');
const jwttoken=require('jsonwebtoken');
const User=require('../models/users');
const route=express.Router();
const nodemailer = require('nodemailer');
const auth=require('../auth/authentication');


var LoggedUserId="";
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:process.env.MAILUSER, // here use your real email
      pass: process.env.MAILPASSWORD // put your password correctly (not in this question please)
    }
  });

route.post('/register',(req,res,next) =>{
    console.log("userid: "+LoggedUserId)
    var mailOptions = {
        from: process.env.MAILUSER, // sender address
        to: req.body.emailPhone, // list of receivers
        subject: 'Email confirmation for your account: Social Media App', // Subject line
        html: req.body.firstName + req.body.lastName+
        '<h1>Please Click this link to confirm your account: </h1> http://localhost:'+ 
        process.env.PORT+"/verify/email/"+LoggedUserId
      // plain text body

      };
    User.findOne({emailPhone:req.body.emailPhone})
    .then((user)=>{
        if(user==null)
        {
            transporter.sendMail(mailOptions, function (err, info) {
                if(err){
                    res.send(err) 
                } 
                else{
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
                            password:hash,
                            image:req.body.image,
                            dob:req.body.dob
                        }).then((user) =>{
                            LoggedUserId=user._id;
                            console.log(LoggedUserId);
                            let token=jwttoken.sign({_id:user._id}, process.env.SECRET);
                            res.json({status:"Registered!!!!",token:token});
                        }).catch(next);
                    });
                }  
             });
        }else{
            let err=new Error('Email already registered');
            err.status=401;
            return next(err);
        }
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


route.get('/userProfile', auth.verifyUser,(req,res)=>{
    res.json(
        {
        _id:req.user._id,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        emailPhone:req.user.emailPhone,
        image:req.user.image,
        dob:req.user.dob,
        reg_date:req.user.reg_date
    }
    );
});


module.exports = route;
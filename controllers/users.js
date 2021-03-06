const express=require('express');
const bcrypt=require('bcryptjs');
const jwttoken=require('jsonwebtoken');
const User=require('../models/users');
const route=express.Router();
const nodemailer = require('nodemailer');
const auth=require('../auth/authentication');



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:process.env.MAILUSER, // here use your real email
      pass: process.env.MAILPASSWORD // put your password correctly (not in this question please)
    }
  });

route.post('/register',(req,res,next) =>{

    User.findOne({emailPhone:req.body.emailPhone})
    .then((user)=>{
        if(user==null)
        {
           
                    let password=req.body.password;
                    bcrypt.hash(password,10,function(err,hash){
                        if(err){
                            // let err=new Error('Error during hashing');
                            // err.status=500;
                            // return next(err);

                            res.json({status:500, message:'Error while hasing'})
                        }
                        User.create({
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            emailPhone:req.body.emailPhone,
                            password:hash,
                            gender:req.body.gender,
                            image:req.body.image,
                            dob:req.body.dob
                        }).then((user) =>{
                            LoggedUserId=user._id;

                            var mailOptions = {
                                from: process.env.MAILUSER, // sender address
                                to: req.body.emailPhone, // list of receivers
                                subject: 'Email confirmation for your account: Social Media App', // Subject line
                                html: req.body.firstName + req.body.lastName+
                                '<h1>Please Click this link to confirm your account: </h1> http://localhost:'+ 
                                process.env.PORT+"/users/verify/"+LoggedUserId
                              // plain text body
                              };

                              transporter.sendMail(mailOptions, function (err, info) {
                                if(err){
                                    res.json({status:500, message:err})
                                } 
                                else{
                                    let token=jwttoken.sign({_id:user._id}, process.env.SECRET);
                            res.json({status:"Registered!!!!",token:token, message:info});
                                }
                        }).catch(next);
                    });
               // }  
             });
        }
        
        else{
            // let err=new Error('Email already registered');
            // err.status=401;
            // return next(err);
            res.json({status:401, message:"Email already registered"})
        }
    });
});


route.post('/login',(req,res,next)=>{
    User.findOne({emailPhone:req.body.emailPhone})
    .then((user)=>{
        if(user==null)
        {
            // let err=new Error('User not registered');
            // err.status=401;
            // return next(err);
            res.status(401)
            res.json({status:401, message:'User not registered'})
        }else if(user.verify==false)
        {
            // let err=new Error('Please verify your account');
            // err.status=401;
            // return next(err);
            res.status(401)
            res.json({status:401, message:'Please verify your account'})
        }
        else{
            bcrypt.compare(req.body.password,user.password)
            .then((isMatch)=>{
                if(!isMatch){
                    // let err=new Error('Password not valid');
                    // err.status=401;
                    // return next(err);
                    res.status(401)
            res.json({status:401, message:'Password not valid'})
                }
                let token=jwttoken.sign({_id: user._id}, process.env.SECRET);
                res.json({status:'You have logged!!!', token:token});
            }).catch(next);
        }
    }).catch(next);
});


route.get('/verify/:id', (req,res,next)=>{
   var id=req.params.id;
   User.findOne({_id:id})
    .then((user)=>{
        if(user==null){
            res.json("No user to verify");
        }
        else if(user.verify==true){
            res.json('You are already verified')
        }
        else{
            User.update({_id:id},
               {
                   verify:true
               }
             ).then((user1)=>{
             res.json("You are verified!!!!")
            }
             ).catch(next)
        }
    })
    .catch(next)
})

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

route.post('/forgot-password', (req,res)=>{
    User.findOne({emailPhone:req.body.emailPhone})
    .then((user)=>{
        if(user==null){
            res.json("User not found")
        }else{
            let decryptPassword=bcrypt.decryptPassword
            
        //     var mailOptions = {
        //         from: process.env.MAILUSER, // sender address
        //         to: req.body.emailPhone, // list of receivers
        //         subject: 'Email confirmation for your account: Social Media App', // Subject line
        //         html: req.body.firstName + req.body.lastName+
        //         '<h1>Your password is  </h1> '+ user.password
        //       // plain text body
        //       };

        //       transporter.sendMail(mailOptions, function (err, info) {
        //         if(err){
        //             res.send(err) 
        //         } 
        //         else{
        //             res.json({user})
        //         }
        // });
    
        }
    })
})


module.exports = route;
const jwtauth=require('jsonwebtoken');
const User=require('../models/users');

const verifyUser=(req,res,next)=>{
    let authicateHeader=req.headers.authorization;
    if(!authicateHeader){
        let err=new Error("Please set bearer token");
        err.status=401;
        return next(err);
    }
    let token=authicateHeader.split('')[1];
    let data;
    try{
        data=jwtauth.verify(token,process.env.SECRET,(err,result)=>{
            if(!result===null){
                next();
            }else{
                next(err);
            }
        });
    }catch(err){
        throw new Error('Json web token not valid!');
    }

    User.findById(data._id)
    .then((user)=>{
        req.user=user;
        next();
    })

}
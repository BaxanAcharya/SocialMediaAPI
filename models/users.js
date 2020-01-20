const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
       require:true,
    },
    lastName:{
        type:String,
        require:true
    },
    emailPhone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    image:{
        type:String
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    reg_date:{
        type:String,
        required:true,
        default:Date.now
    },
    verify:{
        type:Boolean,
        required:true,
        default:false
    },

})

module.exports = mongoose.model('User', userSchema);
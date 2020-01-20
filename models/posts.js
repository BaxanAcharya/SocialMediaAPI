const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    caption:{
        type:String,
    },
    images:{
        type:String
    },
    like:{
        type:Number,
        required:true,
        default:0
    },
    dislike:{
        type:Number,
        required:true,
        default:0
    },
    comment:{
        type:Number,
        required:true,
        default:0
    },
    post_date:{
        type:Date,
        default:Date.now
    },
    user_id:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Post', postSchema);
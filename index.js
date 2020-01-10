const express=require('express');
const mongoose=require('mongoose');
const morgan=require('morgan');
const dotenv=require('dotenv').config();
const cors=require('cors');

const app=express();
app.use(morgan('tiny'));
app.use(express.json());
app.options('*',cors());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+ "/public"))

mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify:false,useCreateIndex:true})
.then((db)=>{
    console.log("Successfully conntected to Mongodb Server")
},(err)=>console.log(err));

app.listen(process.env.PORT,()=>{
    console.log(`App is running at localhost:${process.env.PORT}`);
})
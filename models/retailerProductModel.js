import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema
//const reviewSchema = mongoose.Schema({
//  name:{type: String ,required:true},
//  rating:{type: Number ,required:true},
//  comment:{type: String ,required:true},
//  user:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}
//}, {timestamps:true})

const nameSchema = mongoose.Schema({
  name:{type: String ,required:false}
})

const retailerProductSchema =  mongoose.Schema({
      
     
        name:{type:String ,required:false },
        unit:{type:String,required:false ,default:"0kg"},
        quantity:{type:String,required:false ,default:"0kg"},
        image:{type:String,required:false ,default:"0kg"},
      retailer_user_id:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},

        price:{type:String ,required:true ,default:"0"},
        



},{timestamps:true,strict: false /*you want a createdAt? you add timestamps:true*/})


const Product = mongoose.model('RetailerProducts',retailerProductSchema)

/*the this Product you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true*/

//exports.Product = Product
export default Product
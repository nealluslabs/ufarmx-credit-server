import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema

const inventoryItemsSchema = mongoose.Schema({
        product:{type: String ,required:true},
        quantity:{type: Number ,required:true},
        //farmerName:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}
      }, {timestamps:true})


const containersSchema =  mongoose.Schema({
   
      
        Inventory:[inventoryItemsSchema],
        constainerNumber:{type:String ,required:true ,default:0},
        containerName:{type:String ,required:true ,default:0},
        Deposits:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'deposits'},

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const Farmers = mongoose.model('Containers',containersSchema)

/*the this Farmers you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true
 
 SQL HAS ITS OWN ORM
 
 */

//exports.Farmers = Farmers
export default Farmers
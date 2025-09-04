import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema


const agentsSchema =  mongoose.Schema({
   
      
       created_by:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'users'},
       
        phoneNumber:{type:String ,required:false },
        agentId:{type:String ,required:false },
        firstName:{type:String ,required:false },
        lastName:{type:String ,required:false },
        username:{type:String ,required:true ,default:0},
        gender:{type:String ,required:false },
        age:{type:String ,required:false },
        country:{type:String ,required:false },
        location:{type:String ,required:false },
        created_by:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'admindbs'},
       
        user_id:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'users'},

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})





const Agents = mongoose.model('Agentdbs',agentsSchema)

/*the this Agents you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true*/

//exports.Agents = Agents
export default Agents
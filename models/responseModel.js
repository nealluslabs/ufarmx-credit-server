import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema




const responsesSchema =  mongoose.Schema({
   


        responseObject:{type: mongoose.Schema.Types.Mixed ,required:false },
        
        is_deleted:{type:Boolean ,required:false },

        last_updated_by:{type:mongoose.Schema.Types.ObjectId,required:false},
        form_id:{type:mongoose.Schema.Types.ObjectId,required:false},
        admin_user_id:{type:mongoose.Schema.Types.ObjectId,required:false},
        agent_user_id:{type:mongoose.Schema.Types.ObjectId,required:false},
        agentName:{type:String,required:false},
        formName:{type:String,required:false},
        
        
},{timestamps:true,strict:false /*you want a createdAt? you add timestamps:true*/})


const Responses = mongoose.model('Responsesdbs',responsesSchema)

/*the this Responses you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true
 
 SQL HAS ITS OWN ORM
 
 */

//exports.Responses = Responses
export default Responses
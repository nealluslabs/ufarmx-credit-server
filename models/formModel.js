import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema

const individualFieldsSchema = mongoose.Schema({
               id:{type: String ,required:false},
                key:{type: String ,required:false},
                type:{type: String ,required:false},
                name:{type: String ,required:false},
                prompt:{type: String ,required:false},
                validations:{
                isRequired:{type:Boolean, required:false}
                },
                isExpanded:{type: Boolean ,required:false},

       
      }, {timestamps:false})


const formsSchema =  mongoose.Schema({
   
        
        title:{type:String ,required:false},
        id:{type:String ,required:false},
        quantity:{type:Number ,required:false},
        photo:{type:String ,required:false},
        description:{type:String ,required:false },
        user_id:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'userdbs'},
        isPublic:{type:Boolean ,required:false },
        is_deleted:{type:Boolean ,required:false },
        agents:    {type: [String] ,required:false}, 
        sharedWith:{type: [String] ,required:false}, 
        fields:[individualFieldsSchema],

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const Forms = mongoose.model('Formdbs',formsSchema)

/*the this Forms you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true
 
 SQL HAS ITS OWN ORM
 
 */

//exports.Forms = Forms
export default Forms
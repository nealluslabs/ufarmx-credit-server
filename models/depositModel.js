import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema

const individualDepositsSchema = mongoose.Schema({
        depositNumber:{type: String ,required:true},
       
      }, {timestamps:true})


const depositsSchema =  mongoose.Schema({
   
       
       
       
       
        type_de_culture:{type:String ,required:false },
        addiitonalComments:{type:String ,required:false },

        quantit:{type:Number ,required:false ,default:0},
        tat:{type:String ,required:false},
        //dateOfArrival : { type : Date, default: Date.now },
       
        date_darrive : { type : String,  required:true,default:new Date().toLocaleDateString() },
        joindre_photo_1:{type:String ,required:false ,default:0},
        containerNumber:{type:String ,required:false },
        containerName:{type:String ,required:false },
        cost:{type:String ,required:false },


        containerId:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'containers'},
        farmerId:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'farmers'},
        OriginalResponseId:{type:mongoose.Schema.Types.ObjectId,required:false},
        nom_de_lagriculteur:{type:String ,required:false },

        


},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const Deposits = mongoose.model('Deposits',depositsSchema)

/*the this Deposits you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true
 
 SQL HAS ITS OWN ORM
 
 */

//exports.Deposits = Deposits
export default Deposits
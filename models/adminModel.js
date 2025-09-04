import mongoose from 'mongoose'
import bcrypt from  'bcryptjs'
//const mongoose= require('mongoose')
//const bcrypt= require('bcryptjs')

const Schema = mongoose.Schema
//the use of "Schema" on it's own below is simply the use of the constant above, i later changed it to bypass this constant
const adminSchema =  mongoose.Schema({


        email:{type:String, required:false},
        phoneNumber:{type:String, required:false},
        firstName:{type:String, required:false},
        lastName:{type:String, required:false},
        location:{type:String, required:true},
        user_id:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'userdbs'},
        


},{timestamps:true })

adminSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

adminSchema.pre('save', async function(next){
   if(!this.isModified('password')){
     next()  //.isModified is part of mongoose ? what do they traditionally use it for ? this pre is mongooses middleware though
   }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})

const Admin = mongoose.model('Admindbs',adminSchema)

/*the this User you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

//exports.Admin = Admin
export default Admin
import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const detailsSchema =  mongoose.Schema({
    
    Name:{type: String ,required:true},
    /*Producttype:{type: String },*/
    /*Branch:{type: String },*/
    /*AccountNo:{type:{type:String }},*/
    Nubanno:{type:String},
    Withdrawablebalance:{type:String ,required:true },
    Availablebalance:{type:String,required:true },
    /*Accountoff:{type:String },*/
    /*Status:{type: String },*/
    /*Lastinactivity:{type: String },*/
    /*Sn:{type: String }*/

},{timestamps:true})

const accountSchema =  mongoose.Schema({
details:[detailsSchema],
time:{type: String ,required:false}
},{timestamps:true})



const Account = mongoose.model('Account',accountSchema)

/*the this Account you export (slightly above), you set a new instance
of it anytime you want to save it to database
N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
sql databases come with a structure that you put in through a GUI*/

//exports.Product = Product
export default Account
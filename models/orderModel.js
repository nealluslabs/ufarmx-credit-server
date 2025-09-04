import mongoose from 'mongoose'
//const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema =  mongoose.Schema({

        user:{type: mongoose.Schema.Types.ObjectId,required:true ,ref:'User'},
        orderItems:[
             {name:{type: String ,required:true},
             qty:{type: Number,required:true},
             image:{type: String ,required:true},
             agreedPrice:{type: Number ,required:true},
             price:{type: Number ,required:true},
             vendor:{type: String , required:true},
             vendorId:{type: String , required:true},
             vendorAddress:{type: String , required:true},
             vendorAccountNumber:{type: String , required:true},
             /*the vendors address, you'll put it here */
             promisedQty:{type: Number, required:false, default:0},
             merchantPromise:{type:Boolean,required:false, default:false},
             product:{

               type: mongoose.Schema.Types.ObjectId,
               required:true,
               ref:'Product'

             }}
        ],
        shippingAddress:{

        address:{type: String ,required:true},
        city:{type: String ,required:true},
        postalCode:{type: String ,required:true},
        country:{type: String ,required:true},
      },

       /* paymentMethod:{
          type: String,
          required:false  },*/

        /*paymentResult:{
          /*these results are to come from paypal
          id:{type:String},
          status:{type:String},
          update_time:{type:String},
          email_address:{type:String} },*/

        /*taxPrice:{
          type: Number,
          required:true,
          default:0.0 },*/

          bridgewayProfitAccount:{
            type: String,
            required:true,
            default:"40020008" },
  
        
          deliveryCost:{
          type: String,
          required:true,
          default:0.0 },

        totalPrice:{
          type:Number,
          required:true,
          default:0.0 },

        isPaid:{
          type: Boolean,
          default:false

           },

           paidAt:{
             type: Date,
              },

         insufficientFunds:{
           type: Boolean,
             default:false},

             merchantsCredited:{
              type: Boolean,
              default:false
    
               },


           merchantsCreditedAt:{
             type: Date,
               },
   

          isDelivered:{
          type: Boolean,
          required:true,
          default:false },

          deliveredAt:{
            type: Date,
             },



},{timestamps:true })


const Order = mongoose.model('Orders',orderSchema)

/*the this Order you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

//exports.Order = Order
export default Order
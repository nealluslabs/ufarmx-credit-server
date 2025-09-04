import Admin from '../models/adminModel.js'
//const admin = require('../models/adminModel.js')

import User from '../models/userModel.js'
//const User = require('../models/userModel.js')

import Account from '../models/accountModel.js'

import Product from '../models/productModel.js'

import asyncHandler from 'express-async-handler'
//const asyncHandler = require('express-async-handler')

import generateToken from '../utils/generateToken.js'
//const generateToken = require('../utils/generateToken.js')

/*import xoauth2 from 'xoauth2'*/

import {google} from 'googleapis';

import nodemailer from 'nodemailer'
//const nodemailer = require('nodemailer')

import dotenv from 'dotenv'

import mongoose from 'mongoose'
/*import { gmail } from 'googleapis/build/src/apis/gmail' THIS SHOULDNT BE HERE*/

//I'm using this bit of code to  convert my strings to object Id


dotenv.config()

//@desc  Auth admin & get a token
//@route POST /api/admins/login
//@access Public
const authAdmin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { email, password } = req.body

  console.log("/api/admins/login has been reached!--->",email)
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email);
  }


  function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:\+234|234|0)?[789]\d{9}$|^(?:\+221|221)?7\d{8}$|^(?:\+237|237)?6\d{8}$/;
    return phoneRegex.test(phoneNumber);
  }


if( isValidEmail(email)){
  const admin = await Admin.findOne({ email: email })

  if(admin){
  console.log(admin)
    res.json({
      admin:admin
    })

  }else{

    res.status(401) 
    throw new Error('invalid email or password')

  }


}
else if(isValidPhoneNumber(email)){
  const admin = await Admin.findOne({ phone: email })
  
  if(admin){
 
    console.log(admin)
    res.json({
      admin:admin
     })
 

  }else{
   
    res.status(401) 
    throw new Error('invalid email or password')
  }

}
else{

  res.status(401) 
  throw new Error('invalid email or password')


}


 // const admin = await admin.findOne({ email: email })

 


 /* if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      adminMessage: admin.adminMessage,
      adminMessage: admin.adminMessage,
      isTeller:admin.isTeller,
      isAdmin: admin.isAdmin,
      isMerchant: admin.isMerchant,
      token: generateToken(admin._id),
      adminMessageNotification:admin.adminMessageNotification,
      adminMessageNotification:admin.adminMessageNotification,
      nuban:admin.nuban,
      merchantAddress:admin.merchantAddress?admin.merchantAddress:'this is not a merchant'
    })
  } else {
    res.status(401) 
    throw new Error('invalid email or password')
  }*/


})

//@desc Set the message that the admin wants to convey to the admin
//@route PATCH /api/admins/clientMessage
//@access Public
const presentClientMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { clientId, clientMessage, clientName } =  await req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular admins message so i have to delete by the id i just recieved, HENCE I NEED ID
  await Admin.findByIdAndUpdate({_id:objectId}, { adminMessage: clientMessage , adminMessageNotification:true , adminMessageNotification:false}, { useFindAndModify: false })
  /*clientMessage has been changed to string before being passed into the database cuz of app.use(express.json)*/


  //what we will use to generate a dynamic access token
  const oAuth75Client = new google.auth.OAuth2( process.env.GOOGLE_CLIENT_ID,  process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI)
  
  oAuth75Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = oAuth75Client.getAccessToken().catch(console.error)
     /*console.log(oAuth75Client)*/
     
  try{
    

    //setup of email for nodemailer
    let transporter =   nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      secure: true,
      debug: false,
      logger: true,
      auth: {
        type: 'OAuth2',
        admin: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    })
    //what i actually want to send to the admin/client 
    let mailOptions = {
      from: process.env.EMAIL,
      to: 'dagogouranta@gmail.com'/*'odubanjoadijat@bridgewaymfb.com'*/,
      subject: `Message from client: ${clientName}, --ID: ${clientId}`, 
      text: `${clientMessage}` 
    }

    //actually sending the mail
      transporter.sendMail(mailOptions , function (err, data) {
      if (err) {
        console.log('Error Occured:', err);
        console.log(accessToken)
      } else {
        console.log('Email sent!');
        console.log(accessToken)
      }

    })
  }
   catch(error){
    console.log(error)
  }
  res.status(201)
})


//@desc Set the message that the admin wants to convey to the admin
//@route PATCH /api/admins/adminMessage
//@access Private Admin
const presentAdminMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { bossMessage, clientId, clientEmail, clientName } = req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular admins message so i have to delete by the id i just recieved, HENCE I NEED ID
  await Admin.findByIdAndUpdate({_id:objectId}, { adminMessage:bossMessage, adminMessageNotification:false , adminMessageNotification:true}, { useFindAndModify: false })
 


  //what we will use to generate a dynamic access token
  //I did this above earlier, am i covered by function scope-yes
  /*oAuth75Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
  const accessToken = await oAuth75Client.getAccessToken().token

  //setup of email for nodemailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true,
    debug: false,
    logger: true,
    auth: {
      type: 'OAuth2',
      admin: process.env.EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken

    }
  })
  //what i actually want to send to the admin/client 
  let mailOptions = {
    from: process.env.EMAIL,
    to: clientEmail ,
    cc: 'dagogouranta@gmail.com',
    subject: `Message from bridgeway customer service to ${clientName}`, 
    text: ` Dear ${clientName}, ${bossMessage}` 
  }

  //actually sending the mail
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error Occurs:', err);
    } else {
      console.log('Email sent!');
    }

  })*/

  res.status(201)
})

 //@desc  Verify a admin before payment
//@route POST /api/admins/verify
//@access Public


const verifyAdmin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const {clientId ,personalIdQuery, personalIdAnswer, orderTotal, productIdArray, namesArray } = req.body
  const objectId = new mongoose.Types.ObjectId(clientId)
  const admin = await Admin.findById(objectId) 
  
  //i am not confirming if the admin exists for this bit of code because at this stage, if youve logged in then the admin exists
  const  accountNumber =admin.nuban.toString()
   
  const account = await Account.findOne({},{details:{$elemMatch:{Nubanno:accountNumber}},createdAt:1,time:1}/*,{createdAt:1}*/,{ useFindAndModify: false})  
    
 const Withdrawablebalance = account.details[0].Withdrawablebalance

 let outOfStockProductsArray = []

let nonExistentProductArray = []
    
 let unfoundArray = []

for(let i= 0;i < productIdArray.length;i++){
 const productId = new mongoose.Types.ObjectId(productIdArray[i])
 
 const supposedlyExistingProduct = await Product.findById(productId) ?'exists':'does not exist'
 const product = await Product.findById(productId) ?await Product.findById(productId):{name:"something",countInStock:1} /*countInStock is 1 here, so that our condition will work, in english it means theres one of something that doesnt exist */

 console.log(productIdArray)
 
 if( supposedlyExistingProduct === "does not exist" ){
   nonExistentProductArray.push(supposedlyExistingProduct)
   unfoundArray.push(namesArray[i])
 }

 if  (product.countInStock < 1){
    outOfStockProductsArray.push(product)
 }

 
    } 

    


if(outOfStockProductsArray.length > 0 || nonExistentProductArray.some((item)=>(item === 'does not exist'))){
   
  if(outOfStockProductsArray.length > 0 && !nonExistentProductArray.some((item)=>(item === 'does not exist')))
  {
  const outOfStockProduct = outOfStockProductsArray[0].name /*just using the first product in the array is fine, since we need just one to be out of stock before we send it */
  console.log('it works, we are able to check stock before end')
  res.send({confirmedState:`We are sorry but the products ${outOfStockProductsArray.map((item)=>(item + ' ' + ','))} are now OUT OF STOCK, you must remove them from your cart before you continue `})
  }

   
  if(outOfStockProductsArray.length === 0 && nonExistentProductArray.some((item)=>(item === 'does not exist')))
  {
  
  console.log('it works, we can handle removed products now')
  res.send({confirmedState:`We are sorry but  the product(s) ${unfoundArray.map((item)=>(item + ' ' + ','))} are NO LONGER LISTED on the marketplace,please remove them from your cart before you continue. `})
  }

}else{

 if(Number(Withdrawablebalance) < Number(orderTotal)){
  console.log('it works, there are insufficient funds')
   res.send({confirmedState:'insufficientFunds'})
 }else{


  switch(personalIdQuery){
  case 'momFirstName': 
  if(admin && admin.momFirstName === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'shoeSize':
  if(admin && admin.shoeSize === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'closestFriend':
   if(admin && admin.closestFriend === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
   }
    else{
      return res.send({confirmedState:'false'})
    
   }
    
  case 'childhoodStreet':
  if(admin && admin.childhoodStreet === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
  }
   else{
    return res.send({confirmedState:'false'})
    
   }
  case  'firstEmployment':
  if(admin && admin.firstEmployment === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
  }
   else{
    return res.send({confirmedState:'false'})
    
   }
      
  default: return res.send({confirmedState:'false'})
  
}
 }
   }
  
})



//@desc  Create an admin
//@route POST /api/admins
//@access Private/Admin
const createAdmin = asyncHandler(async (req,res)=>{
 try{
  res.header("Access-Control-Allow-Origin","*")
   const user = new User({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    role:req.body.role,
    email:req.body.email,
    phoneNumber:req.body.phone,
    is_active:req.body.is_active,
    passWord:req.body.password,
    location:req.body.country,
    
   
   })

  

   const createdUser = await user.save()

  
   const admin = new Admin({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    role:req.body.role,
    email:req.body.email,
    phoneNumber:req.body.phone,
    is_active:req.body.is_active,
    password:req.body.password,
    location:req.body.country,
    user_id: new mongoose.Types.ObjectId(createdUser._id)
   
   })

   /*const createdAdmin =*/ await admin.save()

    res.status(201).json({message:"successful"})

  }catch(e){

    console.log("ERROR IS --->",e)
  }

})



//@desc Register a new admin
// route GET api/admins/register
//@access Public
const registerAdmin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { name, email, nuban, password ,momFirstName,shoeSize,closestFriend,childhoodStreet, firstEmployment,isMerchant,pickupAddress } = req.body
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const adminExists = await Admin.findOne({ email: email })
  const accountInUse = await Admin.findOne({nuban:nuban})

  if (adminExists || accountInUse) {
    res.status(400)
    throw new Error('This admin already exists! Check your details and enter them correctly.')
  }

  const account = await Account.findOne({},{details:{$elemMatch:{Nubanno:nuban}},createdAt:1,time:1}/*,{createdAt:1}*/,{ useFindAndModify: false})
     
  console.log(nuban)

  const accountNumberCheck = account.details.length


  if (accountNumberCheck === 0) {
    res.status(400)
    throw new Error('THE ACCOUNT NUMBER YOU ENTERED DOES NOT EXIST. PLEASE CHECK YOUR INPUT AND TRY AGAIN!')
  }

  const admin = await Admin.create({ //apparently create is syntactic sugar for the save method, since creating entails saving i guess
    name: name,
    email: email,
    password: password,
    nuban:nuban,
    momFirstName:momFirstName,
    shoeSize:shoeSize,
    isMerchant:isMerchant,
    isAdmin:false,
    isTeller:false,
    merchantAddress:pickupAddress,
    closestFriend:closestFriend,
    childhoodStreet:childhoodStreet,
    firstEmployment:firstEmployment,
    adminMessageNotification:false,
    adminMessageNotification:false,
  })

  console.log(admin)

     const admin2 = await Admin.findOne({email:email ,nuban:nuban}) 

  if (admin2) {
    res.status(201).json({
      _id: admin2._id,
      name: admin2.name,
      email: admin2.email,
      nuban:admin2.nuban,
      adminMessage: admin2.adminMessage,
      adminMessage: admin2.adminMessage,
      isAdmin: admin2.isAdmin,
      isTeller:admin2.isTeller,
      adminMessageNotification:admin2.adminMessageNotification,
      adminMessageNotification:admin2.adminMessageNotification,
      isMerchant: admin2.isMerchant,
      token: generateToken(admin2._id),
      pickupAddress:admin2.pickupAddress,
      momFirstName:admin2.momFirstName,
      shoeSize:admin2.shoeSize,
      closestFriend:admin2.closestFriend,
      childhoodStreet:admin2.childhoodStreet,
      firstEmployment:admin2.firstEmployment,
      notes:admin2.notes
    })
  } else {
    res.status(400)
    throw new Error('Invalid admin data')
  }
})
//@desc  GET admin profile
//@route GET /api/admins/profile
//@access Private
const getAdminProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     console.log(req.admin._id)
     const objectId = new mongoose.Types.ObjectId(req.admin._id)
  const admin = await Admin.findById(objectId)
  
  /*I am using function scope to  name all my return objects admin, and it works, cuz of scope*/
  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      adminMessage: admin.adminMessage,
      adminMessage: admin.adminMessage,
      isAdmin: admin.isAdmin,
      isTeller:admin.isTeller,
      isMerchant: admin.isMerchant,
      isTeller:admin.isTeller,
      notes:admin.notes
    })
  }
  else {
    res.status(404)
    throw new Error('admin not found')
  }
})

//@desc  update admin profile
//@route PUT /api/admins/profile
//@access Private
const updateAdminProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  
       //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     const objectId = new mongoose.Types.ObjectId(req.admin._id)
  
     const admin = await Admin.findById(objectId)

  if (admin) {
    admin.name = req.body.name || admin.name
    admin.email = req.body.email || admin.email

    if (req.body.password) {
      admin.password = req.body.password
    }
    const updatedadmin = await Admin.save()
    res.json({
      _id: updatedadmin._id,
      name: updatedadmin.name,
      email: updatedadmin.email,
      adminMessage: updatedadmin.adminMessage,
      adminMessage: updatedadmin.adminMessage,
      isAdmin: updatedadmin.isAdmin,
      isMerchant: updatedadmin.isMerchant,
      token: generateToken(updatedadmin._id),
      notes:updatedadmin.notes
    })
  }
  else {
    res.status(404)
    throw new Error('admin not found')
  }
})


//@desc  update admin notes
//@route POST /api/admins/notes
//@access Private
const updateAdminNotes = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
         
       //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     const objectId = new mongoose.Types.ObjectId(req.body.id)
  
   
     const admin = await Admin.findById(objectId)

   console.log(admin)

  if (admin) {
    admin.notes = req.body.notes || admin.notes
    
     await Admin.save()
    
    res.json({
      message:'notes updated!'
    })
  }
  else {
    res.status(404)
    throw new Error('admin not found')
  }
})


//@desc  GET all admins
//@route GET /api/admins
//@access Private/Admin
const getAdmins = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const admins = await Admin.find({isActive:true})
  
  res.json(admins)
})

//@desc  delete a admin
//@route DELETE /api/admins/:id
//@access Private/Admin
const deleteAdmin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params._id)
  const admin = await Admin.findById(objectId)
  
  if (admin) {
    await Admin.remove()
    res.json({ message: 'admin removed' })
  } else {
    res.status(404) //404 is not found
    throw new Error('admin not found')
  }

})

//@desc  GET admin by id
//@route GET /api/admins/:id
//@access Private/Admin
const getAdminById = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  /*console.log(req.params)*/
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const admin = await Admin.find({user_id:objectId})/*.select('-password')*/ //gotta research select
  if (admin) {
    res.json(admin)
  } else {
    res.status(404) //404 is not found
    throw new Error('admin not found')
  }

})





//@desc  update admin
//@route PUT /api/admins/:id
//@access Private/Admin
const updateAdmin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  
  const admin = await Admin.findById(objectId)
  /*the way he names every variable admin, he is aware of function scope and he uses it well*/
  if (admin) {
    admin.name = req.body.name || admin.name
    admin.email = req.body.email || admin.email
    admin.isAdmin = req.body.isAdmin

    const updatedadmin = await Admin.save()
    res.json({
      _id: updatedadmin._id,
      name: updatedadmin.name,
      email: updatedadmin.email,
      adminMessage: updatedadmin.adminMessage,
      adminMessage: updatedadmin.adminMessage,
      isAdmin: updatedadmin.isAdmin,
      isMerchant: updatedadmin.isMerchant,
      isTeller:admin.isTeller,
      notes:updatedadmin.notes
    })
  }
  else {
    res.status(404)
    throw new Error('admin not found')
  }
})


export {
  authAdmin, presentClientMessage, presentAdminMessage, getAdminProfile, createAdmin,registerAdmin,
  updateAdminProfile, updateAdminNotes ,getAdmins, deleteAdmin, getAdminById, updateAdmin,verifyAdmin
}

//exports.authadmin =authadmin
//exports.getadminProfile =getadminProfile
//exports.registeradmin = registeradmin
//exports.updateadminProfile = updateadminProfile
//exports.getadmins = getadmins
//exports.deleteadmin = deleteadmin
//exports.getadminById = getadminById
//exports.updateadmin = updateadmin

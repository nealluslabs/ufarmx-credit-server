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


//dispatch(updateNewPassword({...user,newPassword:formData.password},user.token))


const updateUserPasswordForRetailer = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {newFarmer} = req.body
 console.log('WE ARE IN BACKEND FOR UPDATING A RETAILERS PASSWORD-->',req.body)
  const objectId = new mongoose.Types.ObjectId(req.body._id)
  const user= await User.findById(objectId)

   if(user){
    const salt = await bcrypt.genSalt(10)
    const hashedPassWord = await bcrypt.hash(req.body.newPassword,salt)
    
    //YOU STOPPED HERE , YOURE TRYING TO USE BRCYPT HERE
    user.passWord = req.body.newPassword?(hashedPassWord)  :user.passWord

     console.log('FOR THE user WE FOUND ,WE UPDATED PASSWORD, AND THE USER WAS-->',user)
     const updatedUser = await user.save()
     console.log('WE HAVE SAVED UPDATED USER AFTER CHANGING THE PASSWORD-->')
     res.status(201).json(
      {
        message:"success",
      userInfo:updatedUser
      }
     )
   }else{
     res.status(404)
     throw new Error('USER to update not found')
   }

})

//@desc  Auth user & get a token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { email, password } = req.body

  console.log("/api/users/login has been reached!--->",email)
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email);
  }


  function isValidPhoneNumber(phoneNumber) {n
    const phoneRegex = /^(?:\+234|234|0)?[789]\d{9}$|^(?:\+221|221)?7\d{8}$|^(?:\+237|237)?6\d{8}$/;
    return phoneRegex.test(phoneNumber);
  }


if( isValidEmail(email)){
  const user = await User.findOne({ email: email })



  
  user.matchPassword(password).then(async(passwordsMatched)=>{  

    console.log("DID THE PASSWORDS MATCH??",passwordsMatched)
   
if(user && passwordsMatched===true/*(await user.matchPassword(password))*/ ){ //this is how you match the password
    
  console.log({...user,token:generateToken(user._id)})
    res.json({
      user:{...user,token: generateToken(user._id),}
    })
 
  }else{

   // res.status(401) 
   // throw new Error('invalid email or password')

   res.json({
    message:'invalid email or password'

})

  }
})

}
else if(isValidPhoneNumber(email)){
  const user = await User.findOne({ phone: email })
  
  if(user){
 
    console.log(user)
    res.json({
      user:user
     })
 

  }else{
   
   // res.status(401) 
   // throw new Error('invalid email or password')

    res.json({
      message:'invalid email or password'
  
  })
  }

}
else{

 // res.status(401) 
 // throw new Error('invalid email or password')

 res.json({
  message:'invalid email or password'

})

}


 // const user = await User.findOne({ email: email })

 


 /* if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userMessage: user.userMessage,
      adminMessage: user.adminMessage,
      isTeller:user.isTeller,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
      token: generateToken(user._id),
      userMessageNotification:user.userMessageNotification,
      adminMessageNotification:user.adminMessageNotification,
      nuban:user.nuban,
      merchantAddress:user.merchantAddress?user.merchantAddress:'this is not a merchant'
    })
  } else {
    res.status(401) 
    throw new Error('invalid email or password')
  }*/


})

//@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/clientMessage
//@access Public
const presentClientMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { clientId, clientMessage, clientName } =  await req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
  await User.findByIdAndUpdate({_id:objectId}, { userMessage: clientMessage , adminMessageNotification:true , userMessageNotification:false}, { useFindAndModify: false })
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
        user: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    })
    //what i actually want to send to the user/client 
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


//@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/adminMessage
//@access Private Admin
const presentAdminMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { bossMessage, clientId, clientEmail, clientName } = req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
  await User.findByIdAndUpdate({_id:objectId}, { adminMessage:bossMessage, adminMessageNotification:false , userMessageNotification:true}, { useFindAndModify: false })
 


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
      user: process.env.EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken

    }
  })
  //what i actually want to send to the user/client 
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

 //@desc  Verify a user before payment
//@route POST /api/users/verify
//@access Public


const verifyUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const {clientId ,personalIdQuery, personalIdAnswer, orderTotal, productIdArray, namesArray } = req.body
  const objectId = new mongoose.Types.ObjectId(clientId)
  const user = await User.findById(objectId) 
  
  //i am not confirming if the user exists for this bit of code because at this stage, if youve logged in then the user exists
  const  accountNumber =user.nuban.toString()
   
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
  if(user && user.momFirstName === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'shoeSize':
  if(user && user.shoeSize === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'closestFriend':
   if(user && user.closestFriend === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
   }
    else{
      return res.send({confirmedState:'false'})
    
   }
    
  case 'childhoodStreet':
  if(user && user.childhoodStreet === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
  }
   else{
    return res.send({confirmedState:'false'})
    
   }
  case  'firstEmployment':
  if(user && user.firstEmployment === personalIdAnswer){
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



//@desc Register a new user
// route GET api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { name, email, nuban, password ,momFirstName,shoeSize,closestFriend,childhoodStreet, firstEmployment,isMerchant,pickupAddress } = req.body
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const userExists = await User.findOne({ email: email })
  const accountInUse = await User.findOne({nuban:nuban})

  if (userExists || accountInUse) {
    res.status(400)
    throw new Error('This user already exists! Check your details and enter them correctly.')
  }

  const account = await Account.findOne({},{details:{$elemMatch:{Nubanno:nuban}},createdAt:1,time:1}/*,{createdAt:1}*/,{ useFindAndModify: false})
     
  console.log(nuban)

  const accountNumberCheck = account.details.length


  if (accountNumberCheck === 0) {
    res.status(400)
    throw new Error('THE ACCOUNT NUMBER YOU ENTERED DOES NOT EXIST. PLEASE CHECK YOUR INPUT AND TRY AGAIN!')
  }

  const user = await User.create({ //apparently create is syntactic sugar for the save method, since creating entails saving i guess
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
    userMessageNotification:false,
    adminMessageNotification:false,
  })

  console.log(user)

     const user2 = await User.findOne({email:email ,nuban:nuban}) 

  if (user2) {
    res.status(201).json({
      _id: user2._id,
      name: user2.name,
      email: user2.email,
      nuban:user2.nuban,
      userMessage: user2.userMessage,
      adminMessage: user2.adminMessage,
      isAdmin: user2.isAdmin,
      isTeller:user2.isTeller,
      userMessageNotification:user2.userMessageNotification,
      adminMessageNotification:user2.adminMessageNotification,
      isMerchant: user2.isMerchant,
      token: generateToken(user2._id),
      pickupAddress:user2.pickupAddress,
      momFirstName:user2.momFirstName,
      shoeSize:user2.shoeSize,
      closestFriend:user2.closestFriend,
      childhoodStreet:user2.childhoodStreet,
      firstEmployment:user2.firstEmployment,
      notes:user2.notes
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
//@desc  GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     console.log(req.user._id)
     const objectId = new mongoose.Types.ObjectId(req.user._id)
  const user = await User.findById(objectId)
  
  /*I am using function scope to  name all my return objects user, and it works, cuz of scope*/
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userMessage: user.userMessage,
      adminMessage: user.adminMessage,
      isAdmin: user.isAdmin,
      isTeller:user.isTeller,
      isMerchant: user.isMerchant,
      isTeller:user.isTeller,
      notes:user.notes
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc  update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  
       //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     const objectId = new mongoose.Types.ObjectId(req.user._id)
  
     const user = await User.findById(objectId)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userMessage: updatedUser.userMessage,
      adminMessage: updatedUser.adminMessage,
      isAdmin: updatedUser.isAdmin,
      isMerchant: updatedUser.isMerchant,
      token: generateToken(updatedUser._id),
      notes:updatedUser.notes
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})


//@desc  update user notes
//@route POST /api/users/notes
//@access Private
const updateUserNotes = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
         
       //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     const objectId = new mongoose.Types.ObjectId(req.body.id)
  
   
     const user = await User.findById(objectId)

   console.log(user)

  if (user) {
    user.notes = req.body.notes || user.notes
    
     await user.save()
    
    res.json({
      message:'notes updated!'
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})


//@desc  GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const users = await User.find({})
  
  res.json(users)
})

//@desc  delete a user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params._id)
  const user = await User.findById(objectId)
  
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404) //404 is not found
    throw new Error('User not found')
  }

})

//@desc  GET user by id
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  /*console.log(req.params)*/
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const user = await User.findById(objectId).select('-password') //gotta research select
  if (user) {
    res.json(user)
  } else {
    res.status(404) //404 is not found
    throw new Error('User not found')
  }

})


//@desc  update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  
  const user = await User.findById(objectId)
  /*the way he names every variable user, he is aware of function scope and he uses it well*/
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userMessage: updatedUser.userMessage,
      adminMessage: updatedUser.adminMessage,
      isAdmin: updatedUser.isAdmin,
      isMerchant: updatedUser.isMerchant,
      isTeller:user.isTeller,
      notes:updatedUser.notes
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})


export {
  authUser, presentClientMessage, presentAdminMessage, getUserProfile, registerUser,updateUserPasswordForRetailer,
  updateUserProfile, updateUserNotes ,getUsers, deleteUser, getUserById, updateUser,verifyUser
}

//exports.authUser =authUser
//exports.getUserProfile =getUserProfile
//exports.registerUser = registerUser
//exports.updateUserProfile = updateUserProfile
//exports.getUsers = getUsers
//exports.deleteUser = deleteUser
//exports.getUserById = getUserById
//exports.updateUser = updateUser

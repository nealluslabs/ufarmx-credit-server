import Farmer from '../models/farmerModel.js'
import asyncHandler from 'express-async-handler'
//const Farmer = require('../models/farmerModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'
//const mongoose = require('mongoose')

//@desc  Fetch all farmers in pages
//@route GET /api/farmers
//@access Public

const authUserDbs = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { email, password } = req.body
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  

  const user = await User.findOne({ email: email })
  if (user && (await user.matchPassword(password))) {
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
    res.status(401) //this means unauthorized
    throw new Error('invalid email or password')
  }


})


const getFarmers = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let farmers;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getFarmers controller to tune it's search, based on if there's a vendor name or not 

count = await Farmer.countDocuments(),
farmers = await Farmer.find().limit(pageSize).skip(pageSize *(page-1))

console.log("farmers is --->",farmers)

console.log("count of farmer docs is --->",count)



  res.json({farmers,page,pages:Math.ceil(count/pageSize)})
})



//@desc  Fetch all farmers in one go
//@route GET /api/farmers/all
//@access Public

const getAllFarmers = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let farmers;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getFarmers controller to tune it's search, based on if there's a vendor name or not 

count = await Farmer.countDocuments(),
farmers = await Farmer.find()/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the farmers fetching will slow the dbs */

/*console.log("farmers is --->",farmers)*/

console.log("count of farmer docs is --->",count)



  res.json({farmers,page,pages:Math.ceil(count/pageSize)})
})


//@desc  Fetch all farmers in one go
//@route GET /api/farmers/all
//@access Public
const getFarmersForOneAgent = asyncHandler(async (req,res)=>{

  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1


let count;
let farmers;


 
  console.log("AGENT ID I AM GETTING IS-->",req.query.agentId )

count = await Farmer.countDocuments({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId) }),
farmers = await Farmer.find({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId)}) /*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the farmers fetching will slow the dbs */

console.log("farmers FOR THIS AGENT is --->",farmers)

console.log("count of farmer docs FOR THIS AGENT IS is --->",count)



  res.json({farmers,page,pages:Math.ceil(count/pageSize)})
})


//@desc  Fetch single farmer
//@route GET /api/farmers/:id
//@access Publiccount
const getFarmerById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const farmer = await Farmer.findById(objectId)
  if(farmer){res.json(farmer)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Farmer not found')}
})



const getFarmerByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const farmer= await Farmer.findOne({phone_number:req.query.phone})
  const farmerAlt= await Farmer.findOne({phone:req.query.phone})

  console.log("the farmer with the phone number iss->",farmer)
  console.log("the farmer with the alternate phone number iss->",farmerAlt)


if(farmer){
  res.json(farmer)
}
else if(farmerAlt){
  res.json(farmerAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Farmer not found')
}

})



//@desc  Delete a farmer
//@route DELETE /api/farmers/:id
//@access Private/Admin
const deleteFarmer = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const farmer = await Farmer.findById(objectId)
  if(farmer){
    await farmer.remove()
    res.json({message:'Farmer removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Farmer not found')}
})


//@desc  Create a farmer
//@route POST /api/farmers
//@access Private/Admin
const createFarmer = asyncHandler(async (req,res)=>{
 
  res.header("Access-Control-Allow-Origin","*")
   const farmer = 
   
   req.body.agentId?
   
   new Farmer({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    farmerId:req.body.farmerId,
    agentId:req.body.agentId,
    gender:req.body.gender,
    produce:req.body.produce,
    familySize:req.body.familySize,
    farm_size:req.body.farmSize,
    harvestSize:req.body.harvestSize?req.body.harvestSize:"no harvest size",
    harvestPurpose:req.body.harvestPurpose?req.body.harvestPurpose:"no purpose entered",
   // photo:,
    phone:req.body.phone,
    age:req.body.age,
    password:"123456",
    country:req.body.country,
    market:req.body.market,
    chemicals:req.body.chemicals,
    organicFarmingInterest:req.body.organicFarmingInterest,
    insurance:req.body.insurance,

   })
   
   
   
   :
   new Farmer({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    farmerId:req.body.farmerId,
    gender:req.body.gender,
    produce:req.body.produce,
    familySize:req.body.familySize,
    farm_size:req.body.farmSize,
    harvestSize:req.body.harvestSize?req.body.harvestSize:"no harvest size",
    harvestPurpose:req.body.harvestPurpose?req.body.harvestPurpose:"no purpose entered",
   // photo:,
    phone:req.body.phone,
    age:req.body.age,
    password:"123456",
    country:req.body.country,
    market:req.body.market,
    chemicals:req.body.chemicals,
    organicFarmingInterest:req.body.organicFarmingInterest,
    insurance:req.body.insurance,

   })

   const createdFarmer = await farmer.save()
    res.status(201).json(createdFarmer)

})





//@desc  update a farmer
//@route PUT /api/farmers/:id
//@access Private/Admin
const updateFarmer = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {name,stageName,outsidePrice,agreedPrice,price,description,brand,image,size,countInStock,vendor,vendorId,vendorAddress, vendorAccountNumber} = req.body

  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const farmer= await Farmer.findById(objectId)

   if(farmer){
      farmer.name = name
      farmer.stageName = stageName
      farmer.outsidePrice = outsidePrice
      farmer.agreedPrice = agreedPrice
      farmer.price  = (price*1).toFixed(2)
      farmer.description=description
      farmer.vendor= vendor
      farmer.vendorId= vendorId
      farmer.vendorAddress = vendorAddress
      farmer.vendorAccountNumber = vendorAccountNumber
      farmer.size = size
      farmer.brand = brand
      farmer.countInStock = countInStock
      farmer.image = image

     const updatedFarmer = await farmer.save()
     res.status(201).json(updatedFarmer)
   }else{
     res.status(404)
     throw new Error('Farmer not found')
   }

})


//@desc  update a farmers' count in stock because an order was made
//@route PUT /api/farmers/ordermade
//@access Public
const updateFarmerStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {farmerIdArray,qtyArray} = req.body
    
  console.log(farmerIdArray,qtyArray)

 for(let i= 0;i < farmerIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(farmerIdArray[i])
  const farmer = await Farmer.findById(objectId)
  
   await Farmer.findOneAndUpdate({_id:objectId},{$set:{countInStock: farmer.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/farmers/:id/review
//@access Private/Admin
const createFarmerReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const farmer= await Farmer.findById(objectId)

   if(farmer){
      const alreadyReviewed = farmer.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Farmer already reviewed')}
         
        let numberRating 

        switch(rating){
          case'1': numberRating = 1
          break;
          case'2': numberRating = 2
          break;
          case'3': numberRating = 3
          break;
          case'4': numberRating = 4
          break;
          case'5': numberRating = 5
          default:5
        }

      const review ={
        name:req.user.name,
        comment,
        rating:Number(req.body.rating),
        user:req.user._id
      }

      farmer.reviews.push(review)
      farmer.numReviews = farmer.reviews.length
      const formingNewAverage = farmer.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      farmer.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/farmer.reviews.length)
      console.log(formingNewAverage)
      await farmer.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Farmer not found')
   }

})


//@desc  Get top rated farmers
//@route GET /api/farmers/top
//@access Public
const getTopFarmers = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const farmers = await Farmer.find({}).sort({rating:-1}).limit(3)
  res.json(farmers)
})


export {getFarmers,getFarmersForOneAgent,getAllFarmers,getFarmerByPhone, getFarmerById,deleteFarmer, createFarmer, updateFarmer, updateFarmerStockCount, createFarmerReview ,getTopFarmers}
//exports.getFarmers = getFarmers
//exports.getFarmerById = getFarmerById
//exports.deleteFarmer = deleteFarmer
//exports.createFarmer = createFarmer
//exports.updateFarmer = updateFarmer
//exports.createFarmerReview = createFarmerReview
//exports.getTopFarmers = getTopFarmers
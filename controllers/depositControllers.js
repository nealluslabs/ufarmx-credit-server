import Deposit from '../models/depositModel.js'
import asyncHandler from 'express-async-handler'
//const Deposit = require('../models/depositModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'
//const mongoose = require('mongoose')

//@desc  Fetch all deposits in pages
//@route GET /api/deposits
//@access Public

const getDeposits = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let deposits;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getDeposits controller to tune it's search, based on if there's a vendor name or not 

//count = await Deposit.countDocuments(),
  if(req.query.farmerName){
    console.log("WE HAVE FARMER NAME AND IT IS",req.query.farmerName)
  deposits = await Deposit.find({nom_de_lagriculteur: new RegExp(`${req.query.farmerName}`, 'i') })/*.limit(pageSize).skip(pageSize *(page-1))*/
  }
  else{
  
    deposits = await Deposit.find({containerName:req.query.containerName})
  }
console.log("deposits found is --->",deposits)

//console.log("count of deposit docs is --->",count)



  res.json({deposits/*,page,pages:Math.ceil(count/pageSize)*/})
})



//@desc  Fetch all deposits in one go
//@route GET /api/deposits/all
//@access Public

const getAllDeposits = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let deposits;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getDeposits controller to tune it's search, based on if there's a vendor name or not 

count = await Deposit.countDocuments(),
deposits = await Deposit.find()/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the deposits fetching will slow the dbs */

/*console.log("deposits is --->",deposits)*/

console.log("count of deposit docs is --->",count)



  res.json({deposits,page,pages:Math.ceil(count/pageSize)})
})



//@desc  Fetch all deposits in one go
//@route GET /api/deposits/all
//@access Public

export const getLastThreeDeposits = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
let deposits;

deposits = await Deposit.find().sort({ createdAt: -1 }).limit(5) /**watch for if the deposits fetching will slow the dbs */

console.log(" last 3 deposits is --->",deposits)


  res.json({deposits})
})

//@desc  Create a deposit
//@route POST /api/deposits
//@access Private/Admin
const createDeposit = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   const deposit = new Deposit({
     containerName:req.body.containerName,
     farmerName:req.body.farmerName,
     containerNumber:req.body.containerNumber,
     dateOfArrival:req.body.dateOfArrival,
     product:req.body.product,
     quality:req.body.quality,
     quantity:req.body.quantity,
    // photo:,
     cost:req.body.cost,
     additionalInfo:req.body. additionalInfo,
   })

   const createdDeposit = await deposit.save()
    res.status(201).json(createdDeposit)

})








//@desc  Fetch single deposit
//@route GET /api/deposits/:id
//@access Publiccount
const getDepositById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const deposit = await Deposit.findById(objectId)
  if(deposit){res.json(deposit)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Deposit not found')}
})



const getDepositByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const deposit= await Deposit.findOne({phone_number:req.query.phone})
  const depositAlt= await Deposit.findOne({phone:req.query.phone})

  console.log("the deposit with the phone number iss->",deposit)
  console.log("the deposit with the alternate phone number iss->",depositAlt)


if(deposit){
  res.json(deposit)
}
else if(depositAlt){
  res.json(depositAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Deposit not found')
}

})



//@desc  Delete a deposit
//@route DELETE /api/deposits/:id
//@access Private/Admin
const deleteDeposit = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const deposit = await Deposit.findById(objectId)
  if(deposit){
    await deposit.remove()
    res.json({message:'Deposit removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Deposit not found')}
})





//@desc  update a deposit
//@route PUT /api/deposits/:id
//@access Private/Admin
const updateDeposit = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {name,stageName,outsidePrice,agreedPrice,price,description,brand,image,size,countInStock,vendor,vendorId,vendorAddress, vendorAccountNumber} = req.body

  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const deposit= await Deposit.findById(objectId)

   if(deposit){
      deposit.name = name
      deposit.stageName = stageName
      deposit.outsidePrice = outsidePrice
      deposit.agreedPrice = agreedPrice
      deposit.price  = (price*1).toFixed(2)
      deposit.description=description
      deposit.vendor= vendor
      deposit.vendorId= vendorId
      deposit.vendorAddress = vendorAddress
      deposit.vendorAccountNumber = vendorAccountNumber
      deposit.size = size
      deposit.brand = brand
      deposit.countInStock = countInStock
      deposit.image = image

     const updatedDeposit = await deposit.save()
     res.status(201).json(updatedDeposit)
   }else{
     res.status(404)
     throw new Error('Deposit not found')
   }

})


//@desc  update a deposits' count in stock because an order was made
//@route PUT /api/deposits/ordermade
//@access Public
const updateDepositStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {depositIdArray,qtyArray} = req.body
    
  console.log(depositIdArray,qtyArray)

 for(let i= 0;i < depositIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(depositIdArray[i])
  const deposit = await Deposit.findById(objectId)
  
   await Deposit.findOneAndUpdate({_id:objectId},{$set:{countInStock: deposit.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/deposits/:id/review
//@access Private/Admin
const createDepositReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const deposit= await Deposit.findById(objectId)

   if(deposit){
      const alreadyReviewed = deposit.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Deposit already reviewed')}
         
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

      deposit.reviews.push(review)
      deposit.numReviews = deposit.reviews.length
      const formingNewAverage = deposit.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      deposit.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/deposit.reviews.length)
      console.log(formingNewAverage)
      await deposit.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Deposit not found')
   }

})


//@desc  Get top rated deposits
//@route GET /api/deposits/top
//@access Public
const getTopDeposits = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const deposits = await Deposit.find({}).sort({rating:-1}).limit(3)
  res.json(deposits)
})


export {getDeposits,getAllDeposits,getDepositByPhone, getDepositById,deleteDeposit, createDeposit, updateDeposit, updateDepositStockCount, createDepositReview ,getTopDeposits}
//exports.getDeposits = getDeposits
//exports.getDepositById = getDepositById
//exports.deleteDeposit = deleteDeposit
//exports.createDeposit = createDeposit
//exports.updateDeposit = updateDeposit
//exports.createDepositReview = createDepositReview
//exports.getTopDeposits = getTopDeposits
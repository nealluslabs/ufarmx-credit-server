import Response from '../models/responseModel.js'
import Farmer from '../models/farmerModel.js'
import Deposit from '../models/depositModel.js'
import asyncHandler from 'express-async-handler'
//const Response = require('../models/responseModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'
import RetailerFarmer from '../models/retailerFarmerModel.js'
//const mongoose = require('mongoose')

//@desc  Fetch all responses in pages
//@route GET /api/responses
//@access Public

const getResponses = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let responses;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getResponses controller to tune it's search, based on if there's a vendor name or not 

//count = await Response.countDocuments(),
responses = await Response.find({containerName:req.query.containerName})/*.limit(pageSize).skip(pageSize *(page-1))*/

console.log("responses found is --->",responses)

//console.log("count of response docs is --->",count)



  res.json({responses/*,page,pages:Math.ceil(count/pageSize)*/})
})



//@desc  Fetch all responses in one go
//@route GET /api/responses/all
//@access Public

const getAllResponses = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

let count;
let responses;

 
 
 // I am instructing my getResponses controller to tune it's search, based on if there's a vendor name or not 

count = await Response.countDocuments(),
responses = await Response.find()/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the responses fetching will slow the dbs */

/*console.log("responses is --->",responses)*/

console.log("count of response docs is --->",count)



  res.json({responses,page,pages:Math.ceil(count/pageSize)})
})


//@desc  Fetch all responses in one go
//@route GET /api/responses/all
//@access Public

const getAllResponsesForOneAgent = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

let count;
let responses;

 
 
 // I am instructing my getResponses controller to tune it's search, based on if there's a vendor name or not 

 console.log("agent user id gotten is --->",req.query.agentId)

count = await Response.countDocuments({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId)}),
responses = await Response.find({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId)})/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the responses fetching will slow the dbs */

/*console.log("responses is --->",responses)*/

console.log("count of response docs is --->",count)


console.log("response doc 1 for thiis agent is  is --->",responses)



  res.json({responses,page,pages:Math.ceil(count/pageSize)})
})




//@desc  Fetch all responses in one go
//@route GET /api/responses/all
//@access Public

export const getLastThreeResponses = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
let responses;

responses = await Response.find().sort({ createdAt: -1 }).limit(3)
console.log(" last 3 responses is --->",responses)


  res.json({responses})
})

//@desc  Create a response
//@route POST /api/responses
//@access Private/Admin
const createResponse = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   const response = new Response({
    form_id:new mongoose.Types.ObjectId(req.body.form_id),
     agent_user_id:req.body.agent_user_id,
     admin_user_id:new mongoose.Types.ObjectId(req.body.admin_user_id),
     last_updated_by:new mongoose.Types.ObjectId(req.body.last_updated_by),
     is_deleted:req.body.is_deleted,
     responseObject:req.body.responseObject,
    
   })

   const createdResponse = await response.save()

   //ACCOUNTING FOR ALL SORTS OF FARMER INTAKE FORM AND THEN ADDING FARMERS
   if(req.body.form_id === "65a59487c662a50026d882b4" ||
   req.body.form_id === "64943746c9bab60032545942"||
    req.body.form_id ==="65a7cf31682d210027cca007"){
    
      console.log("Deposits Farmers from backend-->")

      const farmer = new Farmer({
        form_id:new mongoose.Types.ObjectId(req.body.form_id),
         agent_user_id:req.body.agent_user_id,
         admin_user_id:new mongoose.Types.ObjectId(req.body.admin_user_id),
         last_updated_by:new mongoose.Types.ObjectId(req.body.last_updated_by),
         is_deleted:req.body.is_deleted,
         ...req.body.responseObject,
         OriginalResponseId: new mongoose.Types.ObjectId(createdResponse._id),
  
       }) 

      /* const createdFarmer =*/ await farmer.save()



      const retailerFarmer = new RetailerFarmer({
        form_id:new mongoose.Types.ObjectId(req.body.form_id),
         agent_user_id:req.body.agent_user_id,
         admin_user_id:new mongoose.Types.ObjectId(req.body.admin_user_id),
         last_updated_by:new mongoose.Types.ObjectId(req.body.last_updated_by),
         is_deleted:req.body.is_deleted,
         ...req.body.responseObject,
         OriginalResponseId: new mongoose.Types.ObjectId(createdResponse._id),
  
       }) 

      /* const createdFarmer =*/ await retailerFarmer.save()




   }


   if(req.body.form_id === "65d4db41b5cf4a0032dfd3fb" ||
   req.body.form_id === "65d4d727b5cf4a0032dfd3ec"
    ){
     console.log("Deposits Responses from backend-->",req.body)
      const deposit = new Deposit({
        form_id:new mongoose.Types.ObjectId(req.body.form_id),
         last_updated_by:new mongoose.Types.ObjectId(req.body.last_updated_by),
        
         agent_user_id:req.body.agent_user_id,
         admin_user_id:new mongoose.Types.ObjectId(req.body.admin_user_id),
         is_deleted:req.body.is_deleted,
         OriginalResponseId: new mongoose.Types.ObjectId(createdResponse._id),
        
         type_de_culture:req.body['Type de Culture']||req.body['Crop Type'] ,
         addiitonalComments:req.body['Notes ou Commentaires Supplémentaires']||req.body['Additional Notes or Comments'],
         quantit:req.body['Quantité']|| req.body['Quantity'],
         tat:req.body['Condition'] ||'bon',
         date_darrive : (req.body['Date d\'Arrivée'])||(req.body['Date of Arrival']) ,
         joindre_photo_1:req.body['Joindre Photo 1']||req.body['Joindre Photo 2']||req.body['Joindre Photo 3']||req.body['Attach Picture 1']||req.body['Attach Picture 2'] ||req.body['Attach Picture 3'] ,
         containerName:'Velingara',
         nom_de_lagriculteur:req.body['Nom de l\'Agriculteur']||req.body['Farmer Name']  ,


       }) 

      /* const createdFarmer =*/ await deposit.save()

    }

  
    //res.status(201).json(createdResponse)
    if(createdResponse){
    res.status(200).json({message:"success"})
    }else{
      res.status(200).json({message:"failure"})
    }
})



//@desc  update a response
//@route POST /api/responses/update
//@access Public
const updateResponse = asyncHandler(async (req,res)=>{
 


  res.header("Access-Control-Allow-Origin","*")
  const {fields} = req.body
 
  const objectId = new mongoose.Types.ObjectId(fields._id)
  //let response= await Response.findById(objectId)
  let response= await RetailerFarmer.findById(objectId)
  console.log('BACKEND FOR UPDATING RESPONSES HAS BEEN REACHED --->',fields)
 
  /* if(response){
      response.responseObject = fields.responseObject
      response.agent_user_id = new mongoose.Types.ObjectId(fields.agent_user_id)
      response.agentName = fields.agentName
      response.form_id = new mongoose.Types.ObjectId(fields.form_id)
      response.formName = fields.formName
   await response.save()
     res.status(200).json({message:"success"})
   }*/

   if (response) {
    console.log('RETAILER FARMER WAS FOUND --->')
    // Loop through all keys in fields and update the response document
    Object.keys(fields).forEach((key) => {
      // Convert known ObjectId fields if needed
      if (['agent_user_id', 'form_id', '_id'].includes(key) && mongoose.Types.ObjectId.isValid(fields[key])) {
        response[key] = new mongoose.Types.ObjectId(fields[key]);
      } else {
        response[key] = fields[key];
      }
    });


    await response.save()
    res.status(200).json({message:"success"})
  }
   else{
    console.log('THE RESPONSE  FAILED TO UPDATE')
     //res.status(304)
    // throw new Error('Response not found')
     res.status(200).json({message:"failure"})
   }

})


const getSpecificResponse = asyncHandler(async (req, res) => {
  // res.header("Access-Control-Allow-Origin","*")
  const username = req.body.username;
  //username var is an id here, but right now it corresponds to the retailer farmer id , not response id, so i need to do sth about it
  //jul 31 2025 - dagogo
  
  
  try{
    const objectId = new mongoose.Types.ObjectId(username)
    //let response= await Response.findById(objectId)
  
    let response= await RetailerFarmer.findById(objectId)
 // const responses = await Response.findOne({
 // $or: [
 // { "responseObject.name": username },
 // { "responseObject.name__first__last": username }
 // ]
 // });
 console.log("IN BACKEND SPECIFIC RESPONSE ANSWER-->",response);

  
  res.json({ msg: "Responses successfully fetched!", data: response });
  } catch(err) {
  res.json({ msg: "No data to be fetched!", data: null });
  }
  })




//@desc  Fetch single response
//@route GET /api/responses/:id
//@access Publiccount
const getResponseById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const response = await Response.findById(objectId)
  if(response){res.json(response)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Response not found')}
})



const getResponseByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const response= await Response.findOne({phone_number:req.query.phone})
  const responseAlt= await Response.findOne({phone:req.query.phone})

  console.log("the response with the phone number iss->",response)
  console.log("the response with the alternate phone number iss->",responseAlt)


if(response){
  res.json(response)
}
else if(responseAlt){
  res.json(responseAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Response not found')
}

})



//@desc  Delete a response
//@route DELETE /api/responses/:id
//@access Private/Admin
const deleteResponse = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const response = await Response.findById(objectId)
  if(response){
    await response.remove()
    res.json({message:'Response removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Response not found')}
})





//@desc  update a response
//@route PUT /api/responses/:id
//@access Private/Admin
const updateResponseOld = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {name,stageName,outsidePrice,agreedPrice,price,description,brand,image,size,countInStock,vendor,vendorId,vendorAddress, vendorAccountNumber} = req.body

  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const response= await Response.findById(objectId)

   if(response){
      response.name = name
      response.stageName = stageName
      response.outsidePrice = outsidePrice
      response.agreedPrice = agreedPrice
      response.price  = (price*1).toFixed(2)
      response.description=description
      response.vendor= vendor
      response.vendorId= vendorId
      response.vendorAddress = vendorAddress
      response.vendorAccountNumber = vendorAccountNumber
      response.size = size
      response.brand = brand
      response.countInStock = countInStock
      response.image = image

     const updatedResponse = await response.save()
     res.status(201).json(updatedResponse)
   }else{
     res.status(404)
     throw new Error('Response not found')
   }

})


//@desc  update a responses' count in stock because an order was made
//@route PUT /api/responses/ordermade
//@access Public
const updateResponseStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {responseIdArray,qtyArray} = req.body
    
  console.log(responseIdArray,qtyArray)

 for(let i= 0;i < responseIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(responseIdArray[i])
  const response = await Response.findById(objectId)
  
   await Response.findOneAndUpdate({_id:objectId},{$set:{countInStock: response.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/responses/:id/review
//@access Private/Admin
const createResponseReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const response= await Response.findById(objectId)

   if(response){
      const alreadyReviewed = response.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Response already reviewed')}
         
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

      response.reviews.push(review)
      response.numReviews = response.reviews.length
      const formingNewAverage = response.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      response.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/response.reviews.length)
      console.log(formingNewAverage)
      await response.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Response not found')
   }

})


//@desc  Get top rated responses
//@route GET /api/responses/top
//@access Public
const getTopResponses = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const responses = await Response.find({}).sort({rating:-1}).limit(3)
  res.json(responses)
})


export {getSpecificResponse,getResponses,getAllResponses,getAllResponsesForOneAgent,getResponseByPhone, getResponseById,deleteResponse, createResponse, updateResponse, updateResponseStockCount, createResponseReview ,getTopResponses}
//exports.getResponses = getResponses
//exports.getResponseById = getResponseById
//exports.deleteResponse = deleteResponse
//exports.createResponse = createResponse
//exports.updateResponse = updateResponse
//exports.createResponseReview = createResponseReview
//exports.getTopResponses = getTopResponses
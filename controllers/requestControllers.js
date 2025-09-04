import Request from '../models/requestModel.js'
import Farmer from '../models/farmerModel.js'
import Deposit from '../models/depositModel.js'
import asyncHandler from 'express-async-handler'
//const Request = require('../models/requestModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'
import RetailerFarmer from '../models/retailerFarmerModel.js'
//const mongoose = require('mongoose')
import dotenv from 'dotenv'
import axios  from 'axios';
import { createHmac,timingSafeEqual } from 'crypto';
import express from 'express'



//@desc  Fetch all requests in pages
//@route GET /api/requests
//@access Public

dotenv.config()

const getRequests = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let requests;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getRequests controller to tune it's search, based on if there's a vendor name or not 

//count = await Request.countDocuments(),
requests = await Request.find({containerName:req.query.containerName})/*.limit(pageSize).skip(pageSize *(page-1))*/

console.log("requests found is --->",requests)

//console.log("count of request docs is --->",count)



  res.json({requests/*,page,pages:Math.ceil(count/pageSize)*/})
})



//@desc  Fetch all requests in one go
//@route GET /api/requests/all
//@access Public

const getAllRequests = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

let count;
let requests;

 
 
 // I am instructing my getRequests controller to tune it's search, based on if there's a vendor name or not 

count = await Request.countDocuments(),
requests = await Request.find()/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the requests fetching will slow the dbs */

/*console.log("requests is --->",requests)*/

console.log("count of request docs is --->",count)



  res.json({requests})
})


//@desc  Fetch all requests in one go
//@route GET /api/requests/all
//@access Public

const getAllRequestsForOneAgent = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

let count;
let requests;

 
 
 // I am instructing my getRequests controller to tune it's search, based on if there's a vendor name or not 

 console.log("agent user id gotten is --->",req.query.agentId)

count = await Request.countDocuments({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId)}),
requests = await Request.find({agent_user_id:new mongoose.Types.ObjectId(req.query.agentId)})/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the requests fetching will slow the dbs */

/*console.log("requests is --->",requests)*/

console.log("count of request docs is --->",count)


console.log("request doc 1 for thiis agent is  is --->",requests)



  res.json({requests,page,pages:Math.ceil(count/pageSize)})
})




//@desc  Fetch all requests in one go
//@route GET /api/requests/all
//@access Public

export const getLastThreeRequests = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
let requests;

requests = await Request.find().sort({ createdAt: -1 }).limit(3)
console.log(" last 3 requests is --->",requests)


  res.json({requests})
})

//@desc  Create a request
//@route POST /api/requests
//@access Private/Admin
const createRequest = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   const request = new Request({
   totalAmount : fields.totalAmount,
   status : "Pending",
   paymentDueDate : fields.paymentDueDate ,//try mongoose.typesDate or sth
   approvedDate : fields.approvedDate, //same as above comments
   paymentTerms : fields.paymentTerms,
   paymentsMade:[]
    
   })

   const createdRequest = await request.save()


  
    //res.status(201).json(createdRequest)
    if(createdRequest){
    res.status(200).json({message:"success"})
    }else{
      res.status(200).json({message:"failure"})
    }
})



//@desc make a payment on a request
//@route POST /api/makepayment

const makePaymentRequest = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(fields._id)
  let request= await Request.findById(objectId)
  console.log('BACKEND FOR UPDATING RESPONSES HAS BEEN REACHED--->',fields)
  if(request){

    request.totalAmount = fields.totalAmount
   
    request.paymentsMade = [...request.paymentsMade,field.newPayment] 
    //will field.new payment equal just a string or an object
    //that includes time paid, payment amount and payment methos
   // request.ensuroId =  res.ensuro_id
    

    
 //console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',Request)
  //const updatedRequest = await request.save()
 }

   const updatedRequest = await request.save()



  console.log(response.data);


    //res.status(201).json(createdRequest)
    if(updatedRequest){
    res.status(200).json({message:"success"})
    }else{
      res.status(200).json({message:"failure"})
    }
  
})




//@desc  MISS A PAYMENT
//@route POST /api/requests

const missPaymentRequest = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(fields._id)
  let request= await Request.findById(objectId)
  console.log('BACKEND FOR UPDATING RESPONSES HAS BEEN REACHED--->',fields)
 // console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',request)
   if(request){
      request.paymentMissed = true
     
      const createdRequest = await request.save()

const URL = process.env.REACT_APP_ENSURO_API_URL;
const API_KEY = process.env.REACT_APP_ENSURO_API_KEY;
const SIGN_SECRET = REACT_APP_ENSURO_SIGN_SECRET;


async function resolvePolicy() {
  const body = {
    payout: request.totalAmount,
    ensuro_id: request.ensuroId,
  };
  const jsonBody = JSON.stringify(body);

  const signature = createHmac("sha256", SIGN_SECRET)
    .update(jsonBody)
    .digest("hex");

  const response = await axios({
    method: "post",
    url: `${URL}/resolve-policy`,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      "X-Ensuro-Signature": signature,
    },
    data: jsonBody,
  });

  console.log(response.data);
}

resolvePolicy()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


  
    //res.status(201).json(createdRequest)
    if(createdRequest){
    res.status(200).json({message:"success"})
    }else{
      res.status(200).json({message:"failure"})
    }
}

})



//@desc  Approve a request
//@route POST /api/requests/approve
//@access Private/Admin
const approveRequest = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")

  const {fields} = req.body


const URL = process.env.REACT_APP_ENSURO_API_URL;
const API_KEY = process.env.REACT_APP_ENSURO_API_KEY;
const SIGN_SECRET = REACT_APP_ENSURO_SIGN_SECRET;
let updatedRequest; 



function getSixMonthsLaterTimestamp() {
  const now = new Date();
  now.setMonth(now.getMonth() + 6);
  return now.toISOString();
}

async function createNewPolicy() {
  const data = { pricing: "general" };
  const body = {
    payout: fields.totalAmount,
    expiration: getSixMonthsLaterTimestamp(),
    data,
  };
  const jsonBody = JSON.stringify(body);

  const signature = createHmac("sha256", SIGN_SECRET)
    .update(jsonBody)
    .digest("hex");

  const response = await axios({
    method: "post",
    url: `${URL}/new-policy`,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      "X-Ensuro-Signature": signature,
    },
    data: jsonBody,
  });

  console.log(response.data);
  return response.data
}

createNewPolicy()
.then(async(res)=>{

  const objectId = new mongoose.Types.ObjectId(fields._id)
  let request= await Request.findById(objectId)
  console.log('BACKEND FOR CREATING A NEW POLICY HAS BEEN REACHED--->',fields)
  if(request){

    request.totalAmount = fields.totalAmount
    request.status = "Approved"
    request.paymentDueDate = fields.paymentDueDate //try mongoose.typesDate or sth
    request.approvedDate = fields.approvedDate //same as above comments
    request.paymentTerms = fields.paymentTerms
    request.ensuroId =  res.ensuro_id
    

    
 //console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',Request)
   updatedRequest = await request.save()
 }

 await request.save()
})
  .then(() => {


    //res.status(201).json(createdRequest)
    if(updatedRequest){
      res.status(200).json({message:"success"})
      }else{
        res.status(200).json({message:"failure,please try the request again"})
      }
    process.exit(0)
  
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


  
})



/**
 * Generates and validates HMAC-SHA256 signature
 * @param {string} payload - The raw JSON string of the request body
 * @param {string} signature - Signature from `X-Ensuro-Signature` header
 * @param {string} secret - Your webhook secret
 */
const notifyEnsuroCallback = asyncHandler(async (req,res)=>{
 
  const rawBody = req.body.toString();

  const URL = process.env.REACT_APP_ENSURO_API_URL;
  const API_KEY = process.env.REACT_APP_ENSURO_API_KEY;
  const SIGN_SECRET = process.env.REACT_APP_ENSURO_SIGN_SECRET;
 
  

  function checkSignature(payload, signature, secret) {
    const jsonBody = JSON.stringify(payload);


    const expected = 
      createHmac("sha256", secret)
      .update(jsonBody, "utf8")
      .digest("hex");
  
    // Time-safe comparison to prevent timing attacks
    return timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expected, "utf8")
    );
  }


  const signature = req.get("X-Ensuro-Signature");

  if (!signature) {
    return res.status(400).send("Missing signature header");
  }

  if (!checkSignature(rawBody, signature, SIGN_SECRET)) {
    return res.status(403).send("Invalid signature");
  }

  console.log("✅ Webhook verified. Payload:", req.body);
   // Now safely parse JSON
   let parsedBody;
   try {
     parsedBody = JSON.parse(rawBody);
   } catch (err) {
     return res.status(400).send("Invalid JSON");
   }
 

  

  // Process the event
  const { type, policy } = parsedBody;
  switch (type) {
    //FOR THIS WHOLE BLOCK TO WORK, I AM ASSUMING MY ENSURO ID IS GOTTEN IN THE FIRST INSTANCE
    case "policy/creation":{
              // Find request by ensuroId instead of ObjectId
         let request = policy &&  await Request.findOne({ ensuroId: policy.ensuro_id });
         
         console.log('UPDATING CREATION REQUEST BASED ON POLICY ID --->');
         
         if (request) {
           request.policyDetails = policy;
           
           const updatedRequest = await request.save();
           console.log("✅ Request updated successfully:", updatedRequest);
         } else {
           console.log(`❌ No request found with ensuroId: ${policy.ensuro_id}`);
         }
      break;
        }
    case "policy/resolution":{
       
           // Find request by ensuroId instead of ObjectId
             let request = policy &&  await Request.findOne({ ensuroId: policy.ensuro_id });
         
           console.log('UPDATING CREATION REQUEST BASED ON POLICY ID --->');
           
           if (request) {
             request.policyDetails = policy;
             request.actualPayout = policy.actual_payout
             
             const updatedRequest = await request.save();
             console.log("✅ Request updated successfully:", updatedRequest);
           } else {
             console.log(`❌ No request found with ensuroId: ${policy.ensuro_id}`);
           }



      break;
        }
    default:
      console.log(`Unhandled event: ${event}`);
  }

  res.status(200).send("OK");

})


//@desc  update a request
//@route POST /api/requests/update
//@access Public
const updateRequest = asyncHandler(async (req,res)=>{
 


  res.header("Access-Control-Allow-Origin","*")
  const {fields} = req.body
 
  const objectId = new mongoose.Types.ObjectId(fields._id)
  let request= await Request.findById(objectId)
  console.log('BACKEND FOR UPDATING RESPONSES HAS BEEN REACHED--->',fields)
 // console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',request)
   if(request){
      request.requestObject = fields.requestObject
      request.agent_user_id = new mongoose.Types.ObjectId(fields.agent_user_id)
      request.agentName = fields.agentName
      request.form_id = new mongoose.Types.ObjectId(fields.form_id)
      request.formName = fields.formName
      
    //request.updatedAt --> give Joshua this one to do , to prove his understanding


      
   //console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',Request)
     /*const updatedRequest =*/ await request.save()
     res.status(200).json({message:"success"})
   }else{
    console.log('THE RESPONSE  FAILED TO UPDATE')
     //res.status(304)
    // throw new Error('Request not found')
     res.status(200).json({message:"failure"})
   }

})


//@desc  update request details
//@route POST /api/requests/updatedetails
//@access Public
const updateRequestDetails = asyncHandler(async (req,res)=>{
 

  res.header("Access-Control-Allow-Origin","*")
  //const {fields} = req.body
 
  const objectId = new mongoose.Types.ObjectId(req.body._id)
  let request= await Request.findById(objectId)
  console.log('BACKEND FOR UPDATING REQUEST DETAILS HAS BEEN REACHED--->')
 // console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',request)
   if(request){
     //we are only updating due date, status and updated at here
     
       request.paymentDueDate = req.body.paymentDueDate
       request.paymentTerms  = req.body.paymentTerms
       request.status = request.body.status
      
    request.updatedAt = request.updatedAt = new Date().toISOString();

    if (request.status === "Approved" || request.status === "approved") {
      // ✅ Call approveRequest method here
      await approveRequest(req, res);
    }


      
   //console.log('THE RESPONSE TO UPDATE HAS BEEN FOUND',Request)
     /*const updatedRequest =*/ await request.save()
     res.status(200).json({message:"success"})
   }else{
    console.log('THE RESPONSE  FAILED TO UPDATE')
     //res.status(304)
    // throw new Error('Request not found')
     res.status(200).json({message:"failure"})
   }

})





//@desc  Fetch single request
//@route GET /api/requests/:id
//@access Publiccount
const getRequestById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const request = await Request.findById(objectId)
  if(request){res.json(request)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Request not found')}
})



const getRequestByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const request= await Request.findOne({phone_number:req.query.phone})
  const requestAlt= await Request.findOne({phone:req.query.phone})

  console.log("the request with the phone number iss->",request)
  console.log("the request with the alternate phone number iss->",requestAlt)


if(request){
  res.json(request)
}
else if(requestAlt){
  res.json(requestAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Request not found')
}

})



//@desc  Delete a request
//@route DELETE /api/requests/:id
//@access Private/Admin
const deleteRequest = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const request = await Request.findById(objectId)
  if(request){
    await request.remove()
    res.json({message:'Request removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Request not found')}
})






//@desc  update a requests' count in stock because an order was made
//@route PUT /api/requests/ordermade
//@access Public
const updateRequestStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {requestIdArray,qtyArray} = req.body
    
  console.log(requestIdArray,qtyArray)

 for(let i= 0;i < requestIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(requestIdArray[i])
  const request = await Request.findById(objectId)
  
   await Request.findOneAndUpdate({_id:objectId},{$set:{countInStock: request.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/requests/:id/review
//@access Private/Admin
const createRequestReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const request= await Request.findById(objectId)

   if(request){
      const alreadyReviewed = request.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Request already reviewed')}
         
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

      request.reviews.push(review)
      request.numReviews = request.reviews.length
      const formingNewAverage = request.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      request.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/request.reviews.length)
      console.log(formingNewAverage)
      await request.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Request not found')
   }

})


//@desc  Get top rated requests
//@route GET /api/requests/top
//@access Public
const getTopRequests = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const requests = await Request.find({}).sort({rating:-1}).limit(3)
  res.json(requests)
})


export {makePaymentRequest,missPaymentRequest,getRequests,getAllRequests,getAllRequestsForOneAgent,getRequestByPhone, getRequestById,deleteRequest, createRequest,approveRequest,notifyEnsuroCallback, updateRequest,updateRequestDetails, updateRequestStockCount, createRequestReview ,getTopRequests}
//exports.getRequests = getRequests
//exports.getRequestById = getRequestById
//exports.deleteRequest = deleteRequest
//exports.createRequest = createRequestu
//exports.updateRequest = updateRequest
//exports.createRequestReview = createRequestReview
//exports.getTopRequests = getTopRequests
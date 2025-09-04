import Agent from '../models/agentModel.js'
import asyncHandler from 'express-async-handler'
//const Agent = require('../models/agentModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'
import User from '../models/userModel.js'
//const mongoose = require('mongoose')

//@desc  Fetch all agents
//@route GET /api/agents
//@access Public

const getAgents = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let agents;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getAgents controller to tune it's search, based on if there's a vendor name or not 

count = await Agent.countDocuments(),
agents = await Agent.find().limit(pageSize).skip(pageSize *(page-1))

console.log("agents is --->",agents)

console.log("count of agent docs is --->",count)



  res.json({agents,page,pages:Math.ceil(count/pageSize)})
})



const getAllAgents = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let agents;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getForms controller to tune it's search, based on if there's a vendor name or not 

count = await Agent.countDocuments({isActive:true}),
agents = await Agent.find({isActive:true})/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the forms fetching will slow the dbs */

/*console.log("forms is --->",forms)*/

console.log("count of agent docs is --->",count)



  res.json({agents,page,pages:Math.ceil(count/pageSize)})
})





//@desc  Fetch single agent
//@route GET /api/agents/:id
//@access Publiccount
const getAgentById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const agent = await Agent.findById(objectId)
  if(agent){res.json(agent)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Agent not found')}
})

const getAgentByIdQuery = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.query.id)
  const agent = await Agent.findOne({user_id:req.query.id})
  if(agent){res.json(agent)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Agent not found')}
})

const getAgentByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")

 


  const agent= await Agent.findOne({phone_number:req.query.phone})
  const agentAlt= await Agent.findOne({phoneNumber:req.query.phone})
  console.log("the  phone number type iss->",req.query.phone)

  console.log("the agent with the phone number iss->",agent)
  console.log("the agent with the alternate phone number iss->",agentAlt)


if(agent){
  res.json(agent)
}
else if(agentAlt){
  res.json(agentAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Agent not found')
}

})






//@desc  Delete a agent
//@route DELETE /api/agents/:id
//@access Private/Admin
const deleteAgent = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const agent = await Agent.findById(objectId)
  if(agent){
    await agent.remove()
    res.json({message:'Agent removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Agent not found')}
})


//@desc  Create a agent
//@route POST /api/agents
//@access Private/Admin
const createAgent = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  
    
  const user = new User({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    agentId:req.body.agentId,
    gender:req.body.gender,
   
   // photo:,
    phone:req.body.phone,
    role:"Agent",
    password:"123456",
    location:req.body.country,
    
   })

  

   const createdUser = await user.save()
  
  
  
  const agent = new Agent({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    agentId:req.body.agentId,
    gender:req.body.gender,
   
   // photo:,
    phoneNumber:req.body.phone,
   
    password:"123456",
    location:req.body.country,
    
   
   })

   const createdAgent = await agent.save()
    res.status(201).json(createdAgent)

})


//@desc  update a agent
//@route PUT /api/agents/:id
//@access Private/Admin
const updateAgent = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {name,stageName,outsidePrice,agreedPrice,price,description,brand,image,size,countInStock,vendor,vendorId,vendorAddress, vendorAccountNumber} = req.body

  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const agent= await Agent.findById(objectId)

   if(agent){
      agent.name = name
      agent.stageName = stageName
      agent.outsidePrice = outsidePrice
      agent.agreedPrice = agreedPrice
      agent.price  = (price*1).toFixed(2)
      agent.description=description
      agent.vendor= vendor
      agent.vendorId= vendorId
      agent.vendorAddress = vendorAddress
      agent.vendorAccountNumber = vendorAccountNumber
      agent.size = size
      agent.brand = brand
      agent.countInStock = countInStock
      agent.image = image

     const updatedAgent = await agent.save()
     res.status(201).json(updatedAgent)
   }else{
     res.status(404)
     throw new Error('Agent not found')
   }

})


//@desc  update a agents' count in stock because an order was made
//@route PUT /api/agents/ordermade
//@access Public
const updateAgentStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {agentIdArray,qtyArray} = req.body
    
  console.log(agentIdArray,qtyArray)

 for(let i= 0;i < agentIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(agentIdArray[i])
  const agent = await Agent.findById(objectId)
  
   await Agent.findOneAndUpdate({_id:objectId},{$set:{countInStock: agent.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/agents/:id/review
//@access Private/Admin
const createAgentReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const agent= await Agent.findById(objectId)

   if(agent){
      const alreadyReviewed = agent.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Agent already reviewed')}
         
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

      agent.reviews.push(review)
      agent.numReviews = agent.reviews.length
      const formingNewAverage = agent.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      agent.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/agent.reviews.length)
      console.log(formingNewAverage)
      await agent.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Agent not found')
   }

})


//@desc  Get top rated agents
//@route GET /api/agents/top
//@access Public
const getTopAgents = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const agents = await Agent.find({}).sort({rating:-1}).limit(3)
  res.json(agents)
})


export {getAgents,getAllAgents,getAgentByPhone, getAgentById,getAgentByIdQuery,deleteAgent, createAgent, updateAgent, updateAgentStockCount, createAgentReview ,getTopAgents}
//exports.getAgents = getAgents
//exports.getAgentById = getAgentById
//exports.deleteAgent = deleteAgent
//exports.createAgent = createAgent
//exports.updateAgent = updateAgent
//exports.createAgentReview = createAgentReview
//exports.getTopAgents = getTopAgents
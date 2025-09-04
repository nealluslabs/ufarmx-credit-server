import Form from '../models/formModel.js'
import asyncHandler from 'express-async-handler'
//const Form = require('../models/formModel.js')
//const asyncHandler = require('express-async-handler')
import mongoose from 'mongoose'

import Farmer from '../models/farmerModel.js'
//const mongoose = require('mongoose')

//@desc  Fetch all forms in pages
//@route GET /api/forms
//@access Public

const getForms = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let forms;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getForms controller to tune it's search, based on if there's a vendor name or not 

//count = await Form.countDocuments(),
forms = await Form.find({containerName:req.query.containerName})/*.limit(pageSize).skip(pageSize *(page-1))*/

console.log("forms found is --->",forms)

//console.log("count of form docs is --->",count)



  res.json({forms/*,page,pages:Math.ceil(count/pageSize)*/})
})



//@desc  Fetch all forms in one go
//@route GET /api/forms/all
//@access Public

const getAllForms = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 10 //i recommend 4 per page,cuz of whats in the frontend
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName? req.query.vendorName:" "  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let forms;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getForms controller to tune it's search, based on if there's a vendor name or not 

count = await Form.countDocuments(),
forms = await Form.find()/*.limit(pageSize).skip(pageSize *(page-1))*/ /**watch for if the forms fetching will slow the dbs */

/*console.log("forms is --->",forms)*/

console.log("count of form docs is --->",count)



  res.json({forms,page,pages:Math.ceil(count/pageSize)})
})



//@desc  Fetch all forms in one go
//@route GET /api/forms/all
//@access Public

export const getLastThreeForms = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
let forms;

forms = await Form.find().sort({ createdAt: -1 }).limit(3) /**watch for if the forms fetching will slow the dbs */

console.log(" last 3 forms is --->",forms)


  res.json({forms})
})

//@desc  Create a form
//@route POST /api/forms
//@access Private/Admin
const createForm = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   const form = new Form({
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

   const createdForm = await form.save()
    res.status(201).json(createdForm)

})









//@desc  Fetch single form
//@route GET /api/forms/:id
//@access Publiccount
const getFormById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const form = await Form.findById(objectId)
  if(form){res.json(form)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Form not found')}
})






const getFormByPhone = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const form= await Form.findOne({phone_number:req.query.phone})
  const formAlt= await Form.findOne({phone:req.query.phone})

  console.log("the form with the phone number iss->",form)
  console.log("the form with the alternate phone number iss->",formAlt)


if(form){
  res.json(form)
}
else if(formAlt){
  res.json(formAlt)
}else{
res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
  throw new Error('Form not found')
}

})



//@desc  Delete a form
//@route DELETE /api/forms/:id
//@access Private/Admin
const deleteForm = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const form = await Form.findById(objectId)
  if(form){
    await form.remove()
    res.json({message:'Form removed'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Form not found')}
})





//@desc  update a form
//@route POST /api/forms/one
//@access Public
const updateForm = asyncHandler(async (req,res)=>{
 


  res.header("Access-Control-Allow-Origin","*")
  const {id,fields} = req.body
  console.log('BACKEND FOR FORMS HAS BEEN REACHED--->',id)
  const objectId = new mongoose.Types.ObjectId(id)
  const form= await Form.findById(objectId)
  console.log('THE FORM FINDING HAS BEGUN',form)
   if(form){
      form.fields = fields
   console.log('THE FORM HAS BEEN FOUND',form)
     /*const updatedForm =*/ await form.save()
     res.status(200).json({message:"success"})
   }else{
     //res.status(304)
    // throw new Error('Form not found')
     res.status(200).json({message:"failure"})
   }

})


//@desc  update a forms' count in stock because an order was made
//@route PUT /api/forms/ordermade
//@access Public
const updateFormStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {formIdArray,qtyArray} = req.body
    
  console.log(formIdArray,qtyArray)

 for(let i= 0;i < formIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(formIdArray[i])
  const form = await Form.findById(objectId)
  
   await Form.findOneAndUpdate({_id:objectId},{$set:{countInStock: form.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/forms/:id/review
//@access Private/Admin
const createFormReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const form= await Form.findById(objectId)

   if(form){
      const alreadyReviewed = form.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Form already reviewed')}
         
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

      form.reviews.push(review)
      form.numReviews = form.reviews.length
      const formingNewAverage = form.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      form.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/form.reviews.length)
      console.log(formingNewAverage)
      await form.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Form not found')
   }

})


//@desc  Get top rated forms
//@route GET /api/forms/top
//@access Public
const getTopForms = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const forms = await Form.find({}).sort({rating:-1}).limit(3)
  res.json(forms)
})


export {getForms,getAllForms,getFormByPhone, getFormById,deleteForm, createForm, updateForm, updateFormStockCount, createFormReview ,getTopForms}
//exports.getForms = getForms
//exports.getFormById = getFormById
//exports.deleteForm = deleteForm
//exports.createForm = createForm
//exports.updateForm = updateForm
//exports.createFormReview = createFormReview
//exports.getTopForms = getTopForms
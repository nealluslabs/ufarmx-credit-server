import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import RetailerProduct from '../models/retailerProductModel.js'
import Retailer from '../models/retailerModel.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import generateToken from '../utils/generateToken.js'
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });
//const dotenv = require('dotenv')

//const Product = require('../models/productModel.js')
//const asyncHandler = require('express-async-handler')
//const mongoose = require('mongoose')

dotenv.config()




// Initialize the SES client
const sesClient = new SESClient({
  region: "eu-west-2", // e.g. "us-east-1" - come and remove these environemt variables before pushing o !
  credentials: {
    accessKeyId:process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey:process.env.REACT_APP_SECRET_ACCESS_KEY,
  },
});


const getRetailers = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const retailers = await Retailer.find()
  
  res.json(retailers)
})

//@desc  Fetch all products
//@route GET /api/products
//@access Public

const getProducts = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const pageSize = 5 //i recommend 6 per page
     const page = Number(req.query.pageNumber) || 1

 const vendorName = req.query.vendorName  //if your vendorName logic is messing up, come and change it to resemble that of keyword, with the empty object
let count;
let products;

  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' // it means case insensitive 
   }
 
 }:{}
 
 // I am instructing my getProducts controller to tune it's search, based on if there's a vendor name or not 
 vendorName !==''?( /* -- I WANT TO PUT WHERE COUNT IN STOCK IS GREATER THAN ZERO  */
   count = await Product.countDocuments({...keyword, vendor:vendorName}), 
  products = await Product.find({...keyword, vendor:vendorName}).limit(pageSize).skip(pageSize *(page-1))) :
(count = await Product.countDocuments({...keyword,countInStock:{$gt:0}}),
products = await Product.find({...keyword, countInStock:{$gt:0}}).limit(pageSize).skip(pageSize *(page-1)))


  res.json({products,page,pages:Math.ceil(count/pageSize)})
})


//@desc  Add a new Retailer
//@route POST /api/retailer/add
//@access Public
const addNewRetailer = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")

  const userExists = await User.findOne({email:req.body.email  })

  if (userExists) {
    res.status(400)
    throw new Error('This user already exists! Check your details and enter them correctly.')
  }

  const user = req.body.businessType && req.body.businessType === 'individual'?  new User({
  
    
    email:req.body.email,
    is_active:true,
    role:"Retailer",
   
    businessName: req.body.businessName,
    businessAddress: req.body.businessAddress,
    state: req.body.state,
    password: req.body.password,
    storeName: req.body.storeName,
    localGovernment: req.body.localGovernment,
    nearestLandmark: req.body. nearestLandmark,
    yearsInBusiness: req.body.yearsInBusiness,
    shopOwnership: req.body.shopOwnership,
    shopSize: req.body.shopSize,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    gender: req.body.gender,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    stateOfOrigin: req.body.stateOfOrigin,
    localGovernmentOfOrigin: req.body.localGovernmentOfOrigin,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    currentState: req.body.currentState,
    currentLocalGovernment: req.body.currentLocalGovernment,
    utilityType: req.body.utilityType,
    meansOfId: req.body.meansOfId,
    meterNumber: req.body.meterNumber,
    nin: req.body.nin,
    utilityBill: req.body.utilityBillIndUrl,
    idDocument: req.body.photoIdIndUrl,
    
    photoIdIndUrl:req.body.photoIdIndUrl,
   utilityBillIndUrl:req.body.utilityBillIndUrl,
   photoOfShopIndUrl:req.body.photoOfShopIndUrl
   
  })

  : 

  new User({
    email:req.body.email,
    is_active:true,
    role:"Retailer",
    businessName: req.body.businessName,
    cacNumber: req.body.cacNumber,
    taxId: req.body.taxId,
    businessRegistrationDate: req.body.businessRegistrationDate,
    businessAddress: req.body.businessAddress,
    state: req.body.state,
    password: req.body.password,
    localGovernment: req.body.localGovernmen,
    city: req.body. city,
    countryCode: '+234',
    phoneNumber: req.body.phoneNumber,
    businessName: req.body.businessName,
    storeName: req.body.storeName,
    businessAddress: req.body.businessAddress,
    state: req.body.state,
    localGovernment: req.body.localGovernment,
    nearestLandmark: req.body.nearestLandmark,
    yearsInBusiness: req.body.yearsInBusiness,
    shopOwnership: req.body.shopOwnership,
    shopSize: req.body.shopSize,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    gender: req.body.gender,
    email: req.body.email,
    countryCode: '+234',
    phoneNumber: req.body.phoneNumbe,
    nationality: req.body.nationality,
    stateOfOrigin: req.body.stateOfOrigin,
    localGovernmentOrigin: req.body.localGovernmentOrigin,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    currentState: req.body.currentState,
    currentLocalGovernment: req.body.currentLocalGovernment,
    utilityType: req.body.utilityType,
    meansOfId: req.body.meansOfId,
    meterNumber: req.body.meterNumber,
    nin: req.body.nin,
    utilityBill: req.body.utilityBillBusUrl,
    idDocument: req.body.photoIdBusUrl,
    cacUrl:req.body.cacUrl,
    statusReportUrl:req.body.statusReportUrl,
    memartUrl:req.body.memartUrl,
    photoOfShopBusUrl:req.body.photoOfShopBusUrl,
    photoIdBusUrl:req.body.photoIdBusUrl,
    utilityBillBusUrl:req.body.utilityBillBusUrl 

  })

  const createdUser = await user.save()


   const retailer =req.body.businessType && req.body.businessType === 'individual' ?new Retailer({
  
     retailer_user_id:new mongoose.Types.ObjectId(createdUser._id),
     companyEmail:req.body.email,
     businessName: req.body.businessName,
     businessAddress: req.body.businessAddress,
     state: req.body.state,
     password: req.body.password,
     storeName: req.body.storeName,
     localGovernment: req.body.localGovernment,
     nearestLandmark: req.body.nearestLandmark,
     yearsInBusiness: req.body.yearsInBusiness,
     shopOwnership: req.body.shopOwnership,
     shopSize: req.body.shopSize,
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     middleName: req.body.middleName,
     gender: req.body.gender,
     email: req.body.email,
     phoneNumber: req.body.phoneNumber,
     nationality: req.body.nationality,
     stateOfOrigin: req.body.stateOfOrigin,
     localGovernmentOfOrigin: req.body.localGovernmentOfOrigin,
     dateOfBirth: req.body.dateOfBirth,
     address: req.body.address,
     currentState: req.body.currentState,
     currentLocalGovernment: req.body.currentLocalGovernment,
     utilityType: req.body.utilityType,
     meansOfId: req.body.meansOfId,
     meterNumber: req.body.meterNumber,
     nin: req.body.nin,
     utilityBill: null,
     idDocument: null,
     photoIdIndUrl:req.body.photoIdIndUrl,
     utilityBillIndUrl:req.body.utilityBillIndUrl,
     photoOfShopIndUrl:req.body.photoOfShopIndUrl
    
   })
   :
   new Retailer({
    retailer_user_id:new mongoose.Types.ObjectId(createdUser._id),
    companyEmail:req.body.email,
    businessName: req.body.businessName,
    cacNumber: req.body.cacNumber,
    taxId: req.body.taxId,
    businessRegistrationDate: req.body.businessRegistrationDate,
    businessAddress: req.body.businessAddress,
    state: req.body.state,
    password: req.body.password,
    localGovernment: req.body.localGovernment,
    city: req.body.city,
    countryCode: '+234',
    phoneNumber: req.body.phoneNumber,
    businessName: req.body.businessName,
    storeName: req.body.storeName,
    businessAddress: req.body.businessAddress,
    state: req.body.state,
    localGovernment: req.body.localGovernment,
    nearestLandmark: req.body.nearestLandmark,
    yearsInBusiness: req.body.yearsInBusiness,
    shopOwnership: req.body.shopOwnership,
    shopSize: req.body.shopSize,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    gender: req.body.gender,
    email: req.body.email,
    countryCode: '+234',
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    stateOfOrigin: req.body. stateOfOrigin,
    localGovernmentOrigin: req.body.ocalGovernmentOrigin,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    currentState: req.body.currentState,
    currentLocalGovernment: req.body.currentLocalGovernment,
    utilityType: req.body. utilityType,
    meansOfId: req.body.meansOfId,
    meterNumber: req.body.meterNumber,
    nin: req.body.nin,
    utilityBill: req.body.utilityBillBusUrl,
    idDocument: null,
    cacUrl:req.body.cacUrl,
    statusReportUrl:req.body.statusReportUrl,
    memartUrl:req.body.memartUrl,
    photoIdBusUrl:req.body.photoIdBusUrl,
    photoOfShopBusUrl:req.body.photoOfShopBusUrl,
    utilityBillBusUrl:req.body.utilityBillBusUrl
   })



   const createdRetailer = await retailer.save()

    //res.status(201).json(createdretailer)
    if(createdRetailer && createdUser){

      //console.log(createdRetailer && createdUser)
    res.status(201).json({...createdRetailer,token:generateToken(createdUser._id)})
    }else{
      res.status(400).json({message:"invalid user data"})
    }
})






//@desc  Generate risk product
//@route GET /api/retailers/generatecreditscore
//@access Public
const generateCreditScore= asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
  const riskScore = parseFloat((Math.random() * (9.8 - 3) + 3).toFixed(1));
  if(riskScore){res.json({creditScore:riskScore})}
   else{ res.status(404) 
   throw new Error('Risk Socre not found')}
})



const sendWelcomeEmail = asyncHandler(async (req,res)=>{
  try {
    const params = {
      Destination: {
        ToAddresses: [req.body.email], // recipient email
      },
      Message: {
        Body: {
          Text: {
            Data: "Welcome to the Ufarmx platform! 🚀 We're glad to have you on board.",
          },
          Html: {
            Data: ` <h2>Welcome to uFarmX!</h2>
                   <p>Hi <strong>${req.body.firstName &&req.body.firstName||req.body.lastName &&req.body.lastName }</strong>,</p>
                    <p>We’re excited to have you on board the uFarmX platform.</p>
                    <p>Get started by exploring your dashboard.</p>
                    <br/>
                    <p>– The uFarmX Team</p>`,
          },
        },
        Subject: {
          Data: "Welcome to Ufarmx Platform",
        },
      },
      Source: 'info@ufarmx.com'//process.env.SES_FROM_EMAIL, // must be a verified SES sender
    };

    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);

    console.log("✅ Email sent successfully:", response.MessageId);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
});



const updateProduce = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {newFarmer} = req.body
 console.log('WE ARE IN BACKEND FOR PRODUCE UPDATE-->',req.body)
  const objectId = new mongoose.Types.ObjectId(req.body._id)
  const product= await Product.findById(objectId)

   if(product){
    product.name = req.body.name?req.body.name:product.name
     product.localPrice = req.body.localPrice?req.body.localPrice:product.localPrice
     product.nextHarvestDate = req.body.nextHarvestDate?req.body.nextHarvestDate:product.nextHarvestDate
     product.nextHarvestQuantity =  req.body.nextHarvestQuantity?req.body.nextHarvestQuantity:product.nextHarvestQuantity
     product.unitQuantity  = req.body.unitQuantity?req.body.unitQuantity:product.unitQuantity

     console.log('FOR THE product WE FOUND TO UPDATE INPUTS, INPUTS ARE-->',product)
     const updatedProduce = await product.save()
     console.log('WE HAVE SAVED UPDATED PRODUCT PRICE-->')
     res.status(201).json(
      {
        message:"success",
      productInfo:updatedProduce
      }
     )
   }else{
     res.status(404)
     throw new Error('Product to update not found')
   }

})


//const  oldaddProduce = asyncHandler(async (req,res)=>{
//  res.header("Access-Control-Allow-Origin","*")
//  const {newFarmer} = req.body
// console.log('WE ARE IN BACKEND FOR PRODUCE ADD-->',req.body)
//  const objectId = new mongoose.Types.ObjectId(req.body._id)
//  const product= await Product.findById(objectId)
//
//   if(product){
//     product.localPrice = req.body.localPrice?req.body.localPrice:product.localPrice
//     product.nextHarvestDate = req.body.nextHarvestDate?req.body.nextHarvestDate:product.nextHarvestDate
//     product.nextHarvestQuantity =  req.body.nextHarvestQuantity?req.body.nextHarvestQuantity:product.nextHarvestQuantity
//     product.unitQuantity  = req.body.unitQuantity?req.body.unitQuantity:product.unitQuantity
//
//     console.log('FOR THE product WE FOUND TO UPDATE INPUTS, INPUTS ARE-->',product)
//     const updatedProduce = await product.save()
//     console.log('WE HAVE SAVED UPDATED PRODUCT PRICE-->')
//     res.status(201).json(
//      {
//        message:"success",
//      productInfo:updatedProduce
//      }
//     )
//   }else{
//     res.status(404)
//     throw new Error('Product to update not found')
//   }
//
//})


const addProduce = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  console.log("WE ARE IN BACKEND FOR PRODUCE ADD -->", req.body);

  const { nextHarvestDate, nextHarvestQuantity, localPrice, name, unitQuantity } = req.body;

  // Create a new produce entry
  const newProduce = new Product({
    nextHarvestDate,
    nextHarvestQuantity,
    localPrice,
    name,
    unitQuantity
  });

  try {
    const savedProduce = await newProduce.save();
    console.log("NEW PRODUCE ADDED SUCCESSFULLY -->", savedProduce);

    res.status(201).json({
      message: "success",
      productInfo: savedProduce,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to add produce", error: error.message });
  }
});



//@desc  Fetch single product
//@route GET /api/products/:id
//@access Publiccount
const getProductById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const product = await Product.findById(objectId)
  if(product){res.json(product)}
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Product not found')}
})


//@desc  Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.body.productId)
  const product = await Product.findById(objectId)
  if(product){
    await product.remove()
    res.json({message:'success'})
                                    }
   else{ res.status(404) /*with the custom error handler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Product not found')}
})







//@desc  Create a product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   const product = new Product({
     name: 'Sample name',
     stageName:'Sample Name',
     size:'small',
     price: 0,
     outsidePrice:0,
     agreedPrice:0,
     user:req.user._id,
     image:'/images/sample.jpeg',
     brand:"Sample brand",
     category:'Sample category',
     countInStock:0,
     numReviews:0, /*is it reviews or num reviews  */
     description:'Sample Description',
     vendor:'Sample Vendor',
     vendorId:'none',
     vendorAddress:'no address',
     vendorAccountNumber: '0000000000'
   })

   const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})


//@desc  update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {name,stageName,outsidePrice,agreedPrice,price,description,brand,image,size,countInStock,vendor,vendorId,vendorAddress, vendorAccountNumber} = req.body

  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const product= await Product.findById(objectId)

   if(product){
      product.name = name
      product.stageName = stageName
      product.outsidePrice = outsidePrice
      product.agreedPrice = agreedPrice
      product.price  = (price*1).toFixed(2)
      product.description=description
      product.vendor= vendor
      product.vendorId= vendorId
      product.vendorAddress = vendorAddress
      product.vendorAccountNumber = vendorAccountNumber
      product.size = size
      product.brand = brand
      product.countInStock = countInStock
      product.image = image

     const updatedProduct = await product.save()
     res.status(201).json(updatedProduct)
   }else{
     res.status(404)
     throw new Error('Product not found')
   }

})


//@desc  update a products' count in stock because an order was made
//@route PUT /api/products/ordermade
//@access Public
const updateProductStockCount = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {productIdArray,qtyArray} = req.body
    
  console.log(productIdArray,qtyArray)

 for(let i= 0;i < productIdArray.length;i++){
  const objectId = new mongoose.Types.ObjectId(productIdArray[i])
  const product = await Product.findById(objectId)
  
   await Product.findOneAndUpdate({_id:objectId},{$set:{countInStock: product.countInStock-qtyArray[i] }}, { useFindAndModify: false})
  
     } 
   

})





//@desc  Create new review
//@route POST /api/products/:id/review
//@access Private/Admin
const createProductReview = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {rating,comment} = req.body
  console.log(req.body)
  console.log(req.user.name)
  
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const product= await Product.findById(objectId)

   if(product){
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Product already reviewed')}
         
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

      product.reviews.push(review)
      product.numReviews = product.reviews.length
      const formingNewAverage = product.reviews.map((item) =>{item.rating})

      /*consider changing this check to not use == , but rather ===*/ 
      product.rating = formingNewAverage==false?Number(rating):Number(formingNewAverage.reduce((acc,item) =>{item + acc},0)/product.reviews.length)
      console.log(formingNewAverage)
      await product.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Product not found')
   }

})


//@desc  Get top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req,res)=>{
   res.header("Access-Control-Allow-Origin","*")
  const products = await Product.find({}).sort({rating:-1}).limit(3)
  res.json(products)
})



//@desc  Get all rated products
//@route GET /api/products/all
//@access Public
const getAllRetailerProducts = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")

  console.log("WE ARE IN  RETAILER PRODUCT CONTROLLER")

 const products = await RetailerProduct.find({})

 console.log(" RETAILER PRODUCTS FOUND FROM DB INCLUDE-->",products)
 res.json(products)
})



export {generateCreditScore,sendWelcomeEmail,getRetailers,addNewRetailer,getProducts, getProductById,deleteProduct, createProduct,addProduce,updateProduce, updateProduct, updateProductStockCount, createProductReview ,getTopProducts,getAllRetailerProducts}
//exports.getProducts = getProducts
//exports.getProductById = getProductById
//exports.deleteProduct = deleteProduct
//exports.createProduct = createProduct
//exports.updateProduct = updateProduct
//exports.createProductReview = createProductReview
//exports.getTopProducts = getTopProducts
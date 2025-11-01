

import express from 'express'
//const express = require('express')

import path from 'path'
//const path = require('path')

//import products from './data/products.js'
import dotenv from 'dotenv'
//const dotenv = require('dotenv')

import colors from 'colors'
//const colors = require('colors')

import mongoose from 'mongoose'
//const mongoose = require('mongoose')

import morgan from 'morgan'
//const morgan = require('morgan')

import {notFound,errorHandler} from './Middleware/errorMiddleware.js'
//const {notFound,errorHandler} = require('./Middleware/errorMiddleware.js')

import connectDB from './config/db.js'
//const connectDB = require('./config/db.js')

import productRoutes from './routes/productRoutes.js'
//const productRoutes =require('./routes/productRoutes.js')


import retailerProductRoutes from './routes/retailerProductRoutes.js'
//const reatilerProductRoutes =require('./routes/retailerProductRoutes.js')

import retailerFarmerRoutes from './routes/retailerFarmerRoutes.js'
//const reatilerFarmerRoutes =require('./routes/retailerFarmerRoutes.js')


import retailerRoutes from './routes/retailerRoutes.js'
//const reatilerRoutes =require('./routes/retailerRoutes.js')


import farmerRoutes from './routes/farmerRoutes.js'
//const farmerRoutes =require('./routes/farmerRoutes.js')

import depositRoutes from './routes/depositRoutes.js'
//const depositRoutes =require('./routes/depositRoutes.js')

import responsesRoutes from './routes/responsesRoutes.js'
//const responsesRoutes =require('./routes/responsesRoutes.js')

import requestRoutes from './routes/requestRoutes.js'
//const requestRoutes =require('./routes/requestRoutes.js')

import agentRoutes from './routes/agentRoutes.js'
//const agentRoutes =require('./routes/agentRoutes.js')


import formRoutes from './routes/formRoutes.js'
//const formRoutes = require('./routes/formRoutes.js')

import adminRoutes from './routes/adminRoutes.js'
//const userRoutes = require('./routes/userRoutes.js')

import userRoutes from './routes/userRoutes.js'
//const userRoutes = require('./routes/userRoutes.js')

import orderRoutes from './routes/orderRoutes.js'
//const orderRoutes =require('./routes/orderRoutes.js')

import uploadRoutes from './routes/uploadRoutes.js'
//const uploadRoutes =require('./routes/uploadRoutes.js')

import {presentAdminMessage} from './controllers/userControllers.js'
//const {authUser, getUserProfile, registerUser,updateUserProfile,getUsers, deleteUser,getUserById, updateUser} =require('../controllers/userControllers.js')

import {protect,admin} from './Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js')

import asyncHandler from 'express-async-handler'

import cors from 'cors'
import Farmers from './models/farmerModel.js'
//const cors =  require('cors')


dotenv.config()
 
connectDB()

 const app = express()
//if(process.env.NODE_ENV === 'development'){app.use(morgan('dev'))} //I prefer to use morgan in development and not in production

 app.use(express.json())  //this is the new bodyParser that is in express and allows us to read json from req.body



app.use(cors({
  origin:'*',
  methods:["GET","POST","PUT","PATCH","DELETE"],
  credentials:true
}))


app.use(cors());

app.use('/api/retailers',retailerRoutes)

app.use('/api/products',productRoutes)
app.use('/api/retailer-products',retailerProductRoutes)


app.use('/api/retailer-farmers',retailerFarmerRoutes)
app.use('/api/users',userRoutes) 
app.use('/api/admins',adminRoutes) 
app.use('/api/orders',orderRoutes)
app.use('/api/farmers',farmerRoutes)
app.use('/api/forms',formRoutes)
app.use('/api/deposits',depositRoutes)
app.use('/api/responses',responsesRoutes)
app.use('/api/requests',requestRoutes)

app.use('/api/agents',agentRoutes)



app.use('/api/upload',uploadRoutes)

//@desc  Generate risk or credit score
//@route GET /api/generatecreditscore
//@access Public
app.get('/api/generatecreditscore',(req,res)=>{

  res.header("Access-Control-Allow-Origin","*")
 
  const riskScore = parseFloat((Math.random() * (9.8 - 3) + 3).toFixed(1));
  if(riskScore){
    //res.send('API is running on CREDIT SCORE ROUTE...')
   res.json({creditScore:riskScore})
  
  }
   else{ res.status(404) 
   throw new Error('Risk Score not found')}


})
  const mapFarmerToScoreInput = (farmer) => {
    return {
      hasID: farmer.identification?.toLowerCase() === "yes",

      age: Number(farmer.age),

      hasEducationOrTraining: false, 

      cropType: farmer.farmingCrop?.toLowerCase().includes("maize") ||
                farmer.farmingCrop?.toLowerCase().includes("rice") ||
                farmer.farmingCrop?.toLowerCase().includes("cocoa")
                ? "stable" : "highRisk",

      multipleCrops: farmer.farmingCrop?.includes(","),
      
      yieldHistory: "1to2", 

      landOwnership: "seasonalLease",

      farmSize: farmer.farmSize > 1 ? "above" : "average",

      hasInsurance: false, 

      hasIrrigation: farmer.organicFarmingInterest?.toLowerCase() === "yes",

      salesChannel: farmer.market?.toLowerCase().includes("trader")
        ? "regularMarket"
        : "local",

      offFarmIncome: farmer.pre_retailer ? true : false,

      debtToIncome: "medium", 

      miscellaneousScore: 5,

      repaymentHistory: "noRecord", 

      crcScore: "medium", 

      coopMember: false
    };
  }

  const calculateScore = (data) =>{
    let score = 0;

    // 1. Demographics & Identity
    score += data.hasID ? 5 : 2;
    score += (data.age >= 30 && data.age <= 50) ? 2 : 1;
    score += data.hasEducationOrTraining ? 3 : 1;

    // 2. Crop & Production Data
    if (data.cropType === "stable") score += 5;
    else score += 2;

    score += data.multipleCrops ? 5 : 2;

    if (data.yieldHistory === "5plus") score += 10;
    else if (data.yieldHistory === "3to4") score += 7;
    else if (data.yieldHistory === "1to2") score += 5;
    else score += 2;

    // 3. Farm & Land Characteristics
    if (data.landOwnership === "own") score += 8;
    else if (data.landOwnership === "longLease") score += 5;
    else score += 7;

    if (data.farmSize === "above") score += 7;
    else if (data.farmSize === "average") score += 5;
    else score += 3;

    score += data.hasInsurance ? 5 : 3;
    score += data.hasIrrigation ? 5 : 3;

    // 4. Financial & Market Access
    if (data.salesChannel === "contract") score += 10;
    else if (data.salesChannel === "regularMarket") score += 7;
    else score += 3;

    score += data.offFarmIncome ? 5 : 0;

    if (data.debtToIncome === "low") score += 5;
    else if (data.debtToIncome === "medium") score += 3;
    else score += 1;

    score += data.miscellaneousScore ?? 5; 

    // 5. Behavioral & Historical Data
    if (data.repaymentHistory === "always") score += 10;
    else if (data.repaymentHistory === "mixed") score += 6;
    else score += 3;

    if (data.crcScore === "high") score += 10;
    else if (data.crcScore === "medium") score += 6;
    else score += 10;

    score += data.coopMember ? 5 : 5;

    // Final score (scaled)
    const finalScore = (score / 100) * 10;
    return Number(finalScore.toFixed(2));
  }

app.post("/calculate-score", async (req, res) => {
  try {
    const farmer = req.body;

    if (!farmer._id) {
      return res.status(400).json({ success: false, message: "_id is required" });
    }

    const mappedData = mapFarmerToScoreInput(farmer);
    const newScore = calculateScore(mappedData);

    await Farmers.findByIdAndUpdate(farmer._id, { riskScore: newScore });

    return res.json({
      success: true,
      riskScore: newScore
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.get('/api/config/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID)
}) //this is a CONFIG route to access the paypal client id

//this is a temporary route, until i can figure out what is going on with my admin messages
app.patch('/admin/user/:id/api/users/adminMessage',presentAdminMessage)
//this is a temporary route, until i can figure out what is going on with my admin messages END


const __dirname =path.resolve() //OKAY BRAD DID THIS TO MIMIC PATH.JOIN(__DIRNAME) , BECAUSE THE OG __dirname IS ONLY ACCESSIBLE IN COMMON JS AND NOT ES6 SYNTAX
app.use('/uploads', express.static(path.join(__dirname,'/uploads')))

/*app.get('/', (req,res) => {
  res.send('API is running...')
})*/


if(process.NODE_ENV === 'production'){

  app.get('/', (req,res) => {
    res.send('API is running...')
  })

 /* app.use(express.static(path.join(__dirname,'/frontend/build')))

  app.get('*', (req,res) =>{ 
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
  })*/
}else{
  app.get('/', (req,res) => {
    res.send('API is running...')
  })

  /*app.use(express.static(path.join(__dirname,'/frontend/build')))

  app.get('*', (req,res) =>{ 
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
  })*/



}

app.use(notFound)

app.use(errorHandler)

const port=process.env.PORT||6000

app.listen(port, ()=>{
  console.log(`Server is listening in ${process.env.NODE_ENV} mode,
     on port ${port}`)
})

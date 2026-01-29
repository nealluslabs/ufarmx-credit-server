

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

import bodyParser from 'body-parser';


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
      hasID: farmer.hasID?"yes":'no',

      age: parseInt(farmer.age, 10),
      

      hasEducationOrTraining:farmer.educationLevel? true:false, 

      cropType: farmer.farmingCrop?.toLowerCase().includes("maize") ||
                farmer.farmingCrop?.toLowerCase().includes("rice") ||
                farmer.farmingCrop?.toLowerCase().includes("cocoa")
                ? "stable" : "highRisk",

      multipleCrops: farmer.farmingCrop?.includes(","),
      
      yieldHistory:  farmer.farmingExperience &&  parseInt(farmer.farmingExperience) < 3 ?"1to2"
      :
      
      farmer.farmingExperience &&  parseInt(farmer.farmingExperience) < 5 ?"3to4"
      :
       "5plus"

      ,

      landOwnership: farmer.landOwnership? (
        farmer.landOwnership.toLowerCase().includes("owns")?  "own"
        :
       
        farmer.landOwnership.toLowerCase().includes("long term") &&  "longLease"
      
      ):"seasonalLease",//check landownership , shouldnt be hardcoded

      farmSize:farmer.farmSize && farmer.farmSizeUnit && farmer.farmSizeUnit.trim()==="Hectare" && Number(farmer.farmSize) > 1 ? "above" 
      :
      farmer.farmSize && farmer.farmSizeUnit && farmer.farmSizeUnit.trim()==="Acre" && Number(farmer.farmSize) > 0.44 ? "above" 
      : "average", // convert 1 hectare to acres and use 1 hectare as average..look

      hasInsurance: farmer.insurance? true:false, //check farmer.hasInsurance - 

      hasIrrigation:  farmer.irrigation? true:false,

      salesChannel: farmer.salesChannel && farmer.salesChannel.toLowerCase().includes("contract")
        ? "contract":
        farmer.salesChannel && farmer.salesChannel.toLowerCase().includes("open market regular")?
        "regularMarket"
        : "local",

      offFarmIncome: farmer.offFarmIncome? true : false, //farmer.offFarmIncome

      debtToIncome: "low", //change to low 

      miscellaneousScore: 5,

      repaymentHistory: "always", //change to always 

      crcScore: "medium", //change to high

      coopMember:  farmer.farmerGroups? true:false, //farmer.farmerGroups -true or false
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

    score += data.coopMember ? 5 : 0;

    // Final score (scaled)
    const finalScore = (score / 100) * 10;
    return Number(finalScore.toFixed(2));
  }

app.post("/calculate-score", async (req, res) => {
  try {
    const farmer = req.body;

    //if (!farmer._id) {
    //  return res.status(400).json({ success: false, message: "_id is required" });
    //}

    const mappedData = mapFarmerToScoreInput(farmer);
    const newScore = calculateScore(mappedData);

   // await Farmers.findByIdAndUpdate(farmer._id, { riskScore: newScore });

    return res.json({
      success: true,
      riskScore: newScore
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



//HELPER FUNCTION FOR CALCULATE SCORE RETAILER ROUTE
const calculateScoreRetailer = (data) => {
  let score = 0;

  // 1. Business Tenure
  if (data.businessTenure === "moreThan2Years") score += 10;
  else if (data.businessTenure === "oneYear") score += 6;
  else score += 3;

  // 2. Verified 3 Month POS Data
  score += data.verifiedThreeMonthPosData ? 10 : 3;

  // 3. Average Monthly Net Profit
  if (data.avgMonthlyNetProfit === "above150k") score += 10;
  else if (data.avgMonthlyNetProfit === "above75k") score += 6;
  else score += 3;

  // 4. CRC
  if (data.crc === "high") score += 10; //CRC now has a max of 10, where it was 15 before
  else if (data.crc === "medium") score += 5;
  else score += 2;

  // 5. Stock Value
  if (data.stockValue === "above500k") score += 10;
  else if (data.stockValue === "above250k") score += 6;
  else score += 3;

  // 6. Digitally Track Sales
  score += data.digitallyTrackSales ? 10 : 3;

  // 7. Clean Bank Statements
  score += data.cleanBankStatements ? 10 : 3;

  // 8. Physical Store Ownership
  score += data.physicalStoreOwnership ? 10 : 3;

  // 9. Complete and Accurate Application
  score += data.completeAndAccurateApplication ? 10 : 3;


// 9. Complete and Accurate Application
  score += data.willingnessForDailyRepayments ? 5 : 0;
  /*
    Maximum possible score:
    10 + 10 + 10 + 15 + 10 + 10 + 10 + 10 + 10  + 5 = 95 out of 100 , because CRC is max 5 out of 15
  */

  // Final score scaled to 0–10
  const finalScore = (score / 95) * 10;

  return Number(finalScore.toFixed(2));
};



const mapRetailerToScoreInput = (retailer) => {
  // helper: normalize yes/no/boolean strings


  const isYes = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase().includes("yes") ||
             value.toLowerCase().includes("own");
    }
    return true;
  };

  // helper: normalize numeric strings like "150,000"
  const parseAmount = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const numeric = value.replace(/[^0-9]/g, "");
      return numeric ? Number(numeric) : null;
    }
    return null;
  };

  // 1. Business Tenure
  let businessTenure = "lessThan1Year";
  if (typeof retailer.yearsInBusiness === "string") {
    const tenure = (retailer.yearsInBusiness) &&(retailer.yearsInBusiness).toString().toLowerCase();
    if (tenure.includes("years")) businessTenure = "moreThan2Years";
    else if ( tenure.includes("lessthan1year") ) businessTenure = "lessThan1Year";
    else if (tenure.includes("1 year")) businessTenure = "oneYear";
  }


  

  // 2. Verified 3 Month POS Data
  const verifiedThreeMonthPosData = isYes(retailer.verifiedThreeMonthPosData && retailer.verifiedThreeMonthPosData);

  // 3. Average Monthly Net Profit
  let avgMonthlyNetProfit = "above150k";
  if (typeof retailer.avgMonthlyNetProfit === "string") {
    const profitText = retailer.avgMonthlyNetProfit.toLowerCase();
    const profitValue = parseAmount(profitText);

    if (profitValue !== null) {
      if (profitValue > 150000) avgMonthlyNetProfit = "above150k";
      else if (profitValue > 75000) avgMonthlyNetProfit = "above75k";
    } else {
      if (profitText.includes("150")) avgMonthlyNetProfit = "above150k";
      else if (profitText.includes("75")) avgMonthlyNetProfit = "above75k";
    }
  }

  // 4. CRC
  let crc = "high";
  if (typeof retailer.crc === "string") {
    const crcText = retailer.crc.toLowerCase();
    if (crcText.includes("high")) crc = "high";
    else if (crcText.includes("medium")) crc = "medium";
  }

  // 5. Stock Value
  let stockValue = "above500k";
  if (typeof retailer.stockValue === "string") {
    const stockText = retailer.stockValue.toLowerCase();
    const stockAmount = parseAmount(stockText);

   /* if (stockAmount !== null) {
      if (stockAmount > 500000) stockValue = "above500k";
      else if (stockAmount > 250000) stockValue = "above250k";
    }*/ if(stockAmount !== null) {
      if (stockText.includes("500")) stockValue = "above500k";
      else if (stockText.includes("above250")) stockValue = "above250k";
      else if (stockText.includes("below250")) stockValue = "below250k";
    }
  }

  // 6. Digitally Track Sales
  const digitallyTrackSales = isYes(retailer.digitallyTrackSales);

  // 7. Clean Bank Statements
  const cleanBankStatements = isYes(retailer.cleanBankStatements);

  // 8. Physical Store Ownership
  let physicalStoreOwnership = false;
  if (typeof retailer.physicalStoreOwnership === "string") {
    const text = retailer.physicalStoreOwnership.toLowerCase();
    physicalStoreOwnership =
      text.includes("own") || text.includes("yes");
  } else {
    physicalStoreOwnership = isYes(retailer.physicalStoreOwnership);
  }

  // 9. Complete and Accurate Application
  const completeAndAccurateApplication =
    isYes(retailer.completeAndAccurateApplication);

    //10. willingness for daily repayments
    let willingnessForDailyRepayments = true //true is default for now

  return {
    businessTenure,
    verifiedThreeMonthPosData,
    avgMonthlyNetProfit,
    crc,
    stockValue,
    digitallyTrackSales,
    cleanBankStatements,
    physicalStoreOwnership,
    completeAndAccurateApplication,
    willingnessForDailyRepayments
  };
};






app.post("/calculate-score-retailer", async (req, res) => {
  try {
    const retailer = req.body;

    //if (!retailer._id) {
    //  return res.status(400).json({ success: false, message: "_id is required" });
    //}



  console.log('WHAT IS RETAILER ===>',retailer)

  //console.log('BUSINESS TENURE TYPE NKO ===>',typeof(retailer.businessTenure) )


    const mappedData = mapRetailerToScoreInput(retailer);
    const newScore = calculateScoreRetailer(mappedData);

     console.log("RETAILER RISK SCORE FINAL ===>",newScore.toFixed(1))

    return res.json({
      success: true,
      riskScore: newScore && newScore.toFixed(1)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




// dummy data starts here
const FARMER_DATA = {
    name: 'Jane Doe',
    location: 'Nakuru, Kenya',
    linkedRetailer: 'AgriSupply Inc.',
    farmSize: '5 Acres',
    agentContact: '+254712345678 (Agent Ben)'
};

const PAYMENT_DATA = {
    outstandingBalance: '5,100 KES (Due Nov 30)',
    lastPaymentDate: 'Oct 25, 2025',
    lastPaymentAmount: '3,000 KES'
};

const RETAILER_REQUEST = {
    retailerName: 'AgroMart Distributors',
    inputType: 'Fertilizers',
    price: '2,500 KES',
};
// dummy data ends here

app.post('/ussd', (req, res) => {
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text, 
    } = req.body;

    let response = '';

    if (text === '') {
        response = `CON Welcome to UfarmX
        1. Request Farm Inputs
        2. View Retailer Requests
        3. Track My Payments
        4. My Account
        5. Help`;

    // --- 1. REQUEST FARM INPUTS ---
    } else if (text === '1') {
        response = `CON Request Farm Inputs
        1. Seeds
        2. Fertilizers
        3. Pesticides
        4. Equipment
        5. Other Inputs
        0. Back`;

    } else if (text === '1*1' || text === '1*2' || text === '1*3' || text === '1*4' || text === '1*5') {
        const inputType = {
            '1*1': 'Seeds',
            '1*2': 'Fertilizers',
            '1*3': 'Pesticides',
            '1*4': 'Equipment',
            '1*5': 'Other Inputs'
        }[text];
        
        response = `END Your request for ${inputType} has been sent to ${FARMER_DATA.linkedRetailer}. You'll be notified once approved.`;

    } else if (text === '2') {
        response = `CON View Retailer Requests
        1. Pending Requests
        2. Approved Requests
        3. Denied Requests
        0. Back`;
        
    } else if (text === '2*1') {
        response = `CON Pending Requests
      ${RETAILER_REQUEST.retailerName} requested to sell you ${RETAILER_REQUEST.inputType}. 
      Price: ${RETAILER_REQUEST.price}. Approve?
      1. Yes
      2. No
      0. Back`;

    } else if (text === '2*1*1') {
        response = `END Success! Request approved. The retailer will be notified.`;

    } else if (text === '2*1*2') {
        response = `END Request denied. The retailer will be notified.`;

    } else if (text === '3') {
        response = `CON Track My Payments
        1. View Outstanding Balance
        2. View Payment History
        3. Make a Payment (via mobile money)
        0. Back`;

    } else if (text === '3*1') {
        response = `END Your outstanding balance is ${PAYMENT_DATA.outstandingBalance}.`;

    } else if (text === '3*2') {
        response = `END Last payment of ${PAYMENT_DATA.lastPaymentAmount} received on ${PAYMENT_DATA.lastPaymentDate}.`;

    } else if (text === '3*3') {

      response = `CON Make a Payment
        You are about to pay ${PAYMENT_DATA.outstandingBalance.split(' ')[0]} to UfarmX.
        Confirm payment via Mobile Money?
        1. Confirm
        2. Cancel
        0. Back`;
                
    } else if (text === '3*3*1') {
        response = `END Payment of ${PAYMENT_DATA.outstandingBalance.split(' ')[0]} initiated. Please approve the transaction on your mobile phone.`;

    } else if (text === '3*3*2') {
        response = `END Payment cancelled. Thank you.`;


    } else if (text === '4') {
        response = `CON My Account
        1. View My Info
        2. Update My Info
        3. Change Language
        0. Back`;

    } else if (text === '4*1') {
        response = `END My Information:
        Name: ${FARMER_DATA.name}
        Location: ${FARMER_DATA.location}
        Farm Size: ${FARMER_DATA.farmSize}
        Retailer: ${FARMER_DATA.linkedRetailer}`;

    } else if (text === '4*2') {
        response = `END Update info is currently unavailable via USSD. Please contact your agent.`;
        
    } else if (text === '4*3') {
        response = `END Language successfully changed to English (default).`;

    } else if (text === '5') {
        response = `CON Help
      1. Contact My Agent
      2. How UfarmX Works
      3. FAQs
      0. Back`;

    } else if (text === '5*1') {
        response = `END Your agent contact: ${FARMER_DATA.agentContact}. An SMS has been sent to you with these details.`;

    } else if (text === '5*2') {
        response = `END UfarmX connects farmers to approved retailers for inputs using a credit model. Pay back after harvest.`;

    } else if (text === '5*3') {
        response = `END FAQs:
      Q: What is the interest rate? A: Contact your agent for personalized terms. 
      Q: How quickly are requests approved? A: Usually within 48 hours.`;

    } else {
        response = `END Invalid option selected. Please redial to start a new session.`;
    }
    res.set('Content-Type', 'text/plain');
    res.send(response);
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

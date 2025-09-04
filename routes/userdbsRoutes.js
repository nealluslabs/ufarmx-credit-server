import express from 'express'
//const express= require('express')

import {getFarmers,getFarmersForOneAgent, getFarmerById,deleteFarmer,createFarmer, updateFarmer,getTopFarmers,createFarmerReview, updateFarmerStockCount, getFarmerByPhone,getAllFarmers} from '../controllers/farmerControllers.js'
//const {getFarmers, getFarmerById,deleteFarmer,createFarmer, updateFarmer,getTopFarmers,createFarmerReview, updateFarmerStockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.route('/ordermade').put(/*protect,admin,*/updateFarmerStockCount)

router.route('/oneagent').get(getFarmersForOneAgent)
router.route('/').get(getFarmers).post(/*protect,*/createFarmer)

router.route('/all').get(getAllFarmers)



router.route('/byphone').get(getFarmerByPhone)

router.route('/:id/reviews').post(/*protect,*/createFarmerReview)
router.get('/top',getTopFarmers)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access


router.route('/:id').get(getFarmerById).delete(/*protect,admin,*/deleteFarmer).put(/*protect,admin,*/updateFarmer)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
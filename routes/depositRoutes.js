import express from 'express'
//const express= require('express')

import {getDeposits,getAllDeposits, /*getDepositById,*/ createDeposit, getLastThreeDeposits, /*deleteDeposits,updateDeposits,getTopDeposits,createDepositsReview, updateDepositstockCount, getDepositsByPhone,*/} from '../controllers/depositControllers.js'
//const {getDeposits, getDepositsById,deleteDeposits,createDeposits, updateDeposits,getTopDeposits,createDepositsReview, updateDepositstockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
//router.route('/ordermade').put(/*protect,admin,*/updateDepositstockCount)
router.route('/').get(getDeposits).post(/*protect,*/createDeposit)

router.route('/all').get(getAllDeposits)
router.route('/lastthree').get(getLastThreeDeposits)

//router.route('/byphone').get(getDepositsByPhone)

//router.route('/:id/reviews').post(/*protect,*/createDepositsReview)
//router.get('/top',getTopDeposits)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access


//router.route('/:id').get(getDepositsById).delete(/*protect,admin,*/deleteDeposits).put(/*protect,admin,*/updateDeposits)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
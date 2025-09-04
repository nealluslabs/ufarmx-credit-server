import express from 'express'
//const express= require('express')

import {getResponses,getSpecificResponse,getAllResponses,getAllResponsesForOneAgent, /*getDepositById,*/ createResponse,updateResponse, getLastThreeResponses, /*deleteResponses,updateResponses,getTopResponses,createResponsesReview, updateResponsestockCount, getResponsesByPhone,*/} from '../controllers/responseControllers.js'
//const {getResponses, getResponsesById,deleteResponses,createResponses, updateResponses,getTopResponses,createResponsesReview, updateResponsestockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
//router.route('/ordermade').put(/*protect,admin,*/updateResponsestockCount)
router.route('/').get(getResponses).post(/*protect,*/createResponse)

router.route('/update').post(/*protect,*/updateResponse)
router.route("/specific").post(getSpecificResponse);
router.route('/all').get(protect,getAllResponses)
router.route('/oneagent').get(getAllResponsesForOneAgent)
router.route('/lastthree').get(getLastThreeResponses)

//router.route('/byphone').get(getResponsesByPhone)

//router.route('/:id/reviews').post(/*protect,*/createResponsesReview)
//router.get('/top',getTopResponses)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access


//router.route('/:id').get(getResponsesById).delete(/*protect,admin,*/deleteResponses).put(/*protect,admin,*/updateResponses)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
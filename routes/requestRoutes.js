import express from 'express'
//const express= require('express')

import {getRequests,getAllRequests,getAllRequestsForOneAgent, /*getDepositById,*/ createRequest,updateRequest, getLastThreeRequests, approveRequest,makePaymentRequest,missPaymentRequest,notifyEnsuroCallback, /*deleteRequests,updateRequests,getTopRequests,createRequestsReview, updateRequeststockCount, getRequestsByPhone,*/
updateRequestDetails} from '../controllers/requestControllers.js'
//const {getRequests, getRequestsById,deleteRequests,createRequests, updateRequests,getTopRequests,createRequestsReview, updateRequeststockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
//router.route('/ordermade').put(/*protect,admin,*/updateRequeststockCount)
router.route('/').get(getRequests).post(/*protect,*/createRequest)
router.route('/approve').post(approveRequest)

router.route('/notify').post(express.raw({ type: 'application/json' }),notifyEnsuroCallback)

router.route('/makepayment').post(makePaymentRequest)
router.route('/misspayment').post(missPaymentRequest)

router.route('/update').post(/*protect,*/updateRequest)
router.route('/updaterequestDetails').post(/*protect,*/updateRequestDetails)

router.route('/all').get(protect,getAllRequests)
router.route('/oneagent').get(getAllRequestsForOneAgent)
router.route('/lastthree').get(getLastThreeRequests)

//router.route('/byphone').get(getRequestsByPhone)

//router.route('/:id/reviews').post(/*protect,*/createRequestsReview)
//router.get('/top',getTopRequests)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access


//router.route('/:id').get(getRequestsById).delete(/*protect,admin,*/deleteRequests).put(/*protect,admin,*/updateRequests)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
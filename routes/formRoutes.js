import express from 'express'
//const express= require('express')

import {getForms,getAllForms, /*getDepositById,*/ updateForm,createForm, getLastThreeForms, /*deleteForms,updateForms,getTopForms,createFormsReview, updateFormstockCount, getFormsByPhone,*/} from '../controllers/formControllers.js'
//const {getForms, getFormsById,deleteForms,createForms, updateForms,getTopForms,createFormsReview, updateFormstockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
//router.route('/ordermade').put(/*protect,admin,*/updateResponsestockCount)
router.route('/').get(getForms).post(/*protect,*/updateForm)
router.route('/one').post(updateForm)
router.route('/all').get(/*protect,*/getAllForms)
//router.route('/oneagent').get(getAllFormsForOneAgent)
router.route('/lastthree').get(getLastThreeForms)

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
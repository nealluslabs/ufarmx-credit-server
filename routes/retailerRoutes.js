import express from 'express'
//const express= require('express')

import {getProducts, getProductById,deleteProduct, updateProduct,getTopProducts,getAllRetailerProducts,createProductReview, updateProductStockCount,updateProduce,addProduce,getRetailers,sendWelcomeEmail,generateCreditScore} from '../controllers/retailerControllers.js'
//const {getProducts, getProductById,deleteProduct,createProduct, updateProduct,getTopProducts,createProductReview, updateProductStockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
import { addNewRetailer } from '../controllers/retailerControllers.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
//router.route('/add').post(addNewRetailer)
router.route('/ordermade').put(protect/*,admin*/,updateProductStockCount)
router.route('/').get(getRetailers).post(/*protect,*/addNewRetailer)
router.route('/welcomeemail').post(sendWelcomeEmail)
router.route('/generatecreditscore').post(generateCreditScore)
router.route('/:id/reviews').post(protect,createProductReview)
router.get('/top',getTopProducts)


router.get('/all',getAllRetailerProducts)
router.route('/updateProduce').post(updateProduce)
router.route('/addProduce').post(addProduce)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access

 router.route('/deleteSingleProduct').post(deleteProduct)
 
router.route('/:id').get(getProductById).delete(protect,admin,deleteProduct).put(protect/*,admin*/,updateProduct)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
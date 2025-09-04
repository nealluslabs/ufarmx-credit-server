import express from 'express'
//const express= require('express')

import {addNewRetailerProduct,getProducts,deleteProduct,createProduct, updateProduct,getTopProducts,getAllRetailerProducts,createProductReview, updateProductStockCount,updateProduce,addProduce} from '../controllers/retailerProductControllers.js'
//const {getProducts, getProductById,deleteProduct,createProduct, updateProduct,getTopProducts,createProductReview, updateProductStockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
import { getAllRetailerFarmers, getRetailerFarmerById } from '../controllers/retailerFarmerControllers.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.route('/:id').get(getRetailerFarmerById).delete(protect,admin,deleteProduct).put(protect/*,admin*/,updateProduct)
router.route('/add').post(addNewRetailerProduct)
router.route('/ordermade').put(protect/*,admin*/,updateProductStockCount)
router.route('/').get(getProducts).post(protect,createProduct)
router.route('/:id/reviews').post(protect,createProductReview)
router.get('/top',getTopProducts)


router.get('/all/:id',protect,getAllRetailerFarmers)
router.route('/updateProduce').post(updateProduce)
router.route('/addProduce').post(addProduce)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access

 router.route('/deleteSingleProduct').post(deleteProduct)
 

                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
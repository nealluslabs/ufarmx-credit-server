import express from 'express'
//const express= require('express')

import {addNewRetailerProduct,getProducts, getProductById,deleteProduct,createProduct, updateProduct,getTopProducts,getAllRetailerProducts,createProductReview, updateProductStockCount,updateProduce,addProduce, getAllRetailerProductsPeriod} from '../controllers/retailerProductControllers.js'
//const {getProducts, getProductById,deleteProduct,createProduct, updateProduct,getTopProducts,createProductReview, updateProductStockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.route('/add').post(addNewRetailerProduct)
router.route('/ordermade').put(protect/*,admin*/,updateProductStockCount)
router.route('/').get(getProducts).post(protect,createProduct)
router.route('/:id/reviews').post(protect,createProductReview)
router.get('/top',getTopProducts)

router.get('/period',getAllRetailerProductsPeriod)

router.get('/all/:id',getAllRetailerProducts)
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
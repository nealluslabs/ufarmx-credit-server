import express from 'express'
//const express= require('express')

import {getAgents, getAgentById,deleteAgent,createAgent, updateAgent,getTopAgents,createAgentReview, updateAgentStockCount, getAgentByPhone,getAllAgents, getAgentByIdQuery} from '../controllers/agentControllers.js'
//const {getAgents, getAgentById,deleteAgent,createAgent, updateAgent,getTopAgents,createAgentReview, updateAgentStockCount}= require('../controllers/productControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js') 

const router = express.Router()
  
//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.route('/ordermade').put(/*protect,admin,*/updateAgentStockCount)
router.route('/').get(getAgents).post(/*protect,*/createAgent)
router.route('/byid').get(getAgentByIdQuery)
router.route('/all').get(getAllAgents) 

router.route('/byphone').get(getAgentByPhone)


router.route('/:id/reviews').post(/*protect,*/createAgentReview)
router.get('/top',getTopAgents)

//TEMPORARILY DISABLING ALL ADMIN TOKENS

//@Fetch single product
//@GET api/products/:id
//@@Public access


router.route('/:id').get(getAgentById).delete(/*protect,admin,*/deleteAgent).put(/*protect,admin,*/updateAgent)
                       /*the admin you commented out above is your defence against casual
                        users manually trying to edit a product, maybe make another middleware called merchant that grants
                        limited access,like if the 'merchant' middleware is on the route, 
                        both admins and merchants can access it 
                        */

//exports.router = router;
export default router
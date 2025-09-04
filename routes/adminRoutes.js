import express from 'express'
//const express = require('express')

import {authAdmin,presentClientMessage,presentAdminMessage, getAdminProfile, registerAdmin,updateAdminProfile,updateAdminNotes,getAdmins, deleteAdmin,getAdminById, updateAdmin,verifyAdmin, createAdmin} from '../controllers/adminControllers.js'
//const {authAdmin,presentClientMessage,presentAdminMessage, getAdminProfile, registerAdmin,updateAdminProfile,updateAdminNotes,getAdmins, deleteAdmin,getAdminById, updateAdmin,verifyAdmin} =require('../controllers/adminControllers.js')

import {protect,admin} from '../Middleware/authMiddleware.js'
//const {protect,admin} = require('../Middleware/authMiddleware.js')

const router = express.Router()

//@Fetch all products
//@GET api/Admins/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.route('/login').post(authAdmin)
router.route('/').post(createAdmin).get(/*protect,admin,*/getAdmins)

router.route('/notes').put(protect,updateAdminNotes)
router.route('/clientMessage').patch(presentClientMessage)
router.route('/adminMessage').patch(protect,admin,presentAdminMessage)
router.route('/verify').post(verifyAdmin)
router.route('/profile').get(protect, getAdminProfile).put(protect,updateAdminProfile)
//in the get route, protect is the middleware, thats how you implement middleware in this syntax, so smooth,no app.use)
router.route('/:id').delete(protect,admin,deleteAdmin).get(/*protect,admin,*/getAdminById).put(protect,admin,updateAdmin)

//exports.router =router ;
export default router
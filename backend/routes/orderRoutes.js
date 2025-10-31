import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { allOrders, placeOrder, stripeSession, updateStatus, userOrders, verifyPayment } from '../controller/orderController.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRoutes = express.Router()

//for User
orderRoutes.post("/placeorder",isAuth,placeOrder)
orderRoutes.post("/stripe-session",isAuth,stripeSession)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.get("/verify",verifyPayment)

 
//for Admin
orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.post("/status",adminAuth,updateStatus)

export default orderRoutes
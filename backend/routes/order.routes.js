import express from "express";

import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders,  getOrderById,  placeOrder, updateOrderStatus ,sentDeliveryOtp,verifyDeliveryOtp, verifyPayment} from "../controllers/order.controllers.js";

const orderRouter=express.Router();
orderRouter.post("/place-order",isAuth,placeOrder);
orderRouter.get("/my-orders",isAuth,getMyOrders);

orderRouter.get("/get-assignments",isAuth,getDeliveryBoyAssignment);
orderRouter.get("/accept-order/:assignmentId",isAuth,acceptOrder);
orderRouter.get("/get-current-order",isAuth,getCurrentOrder);
orderRouter.get("/get-order-by-id/:orderId",isAuth,getOrderById);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRouter.post("/send-delivery-otp",isAuth,sentDeliveryOtp)
orderRouter.post("/verify-delivery-otp",isAuth,verifyDeliveryOtp)
orderRouter.post("/verify-payment",isAuth,verifyPayment)
export default orderRouter;
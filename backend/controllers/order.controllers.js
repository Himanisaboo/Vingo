import Shop from "../models/shop.models.js"
import Order from "../models/order.models.js";
import User from "../models/user.models.js";
import DeliveryAssignment from "../models/deliveryAssignment.models.js";
export const placeOrder=async(req,res)=>{
    try{
   const {cartItems,paymentMethod,deliveryAddress,totalAmount}=req.body
   if(!cartItems || cartItems.length==0 ){
    return res.status(400).json({message:"cart is empty"})
   }
   if(!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
    return res.status(400).json({message:"sent complete deliveryAddress"})
   }
const groupItemsByShop={}
cartItems.forEach(item=>{
    const shopId=item.shop
    if(!groupItemsByShop[shopId]){
    groupItemsByShop[shopId]=[]
    }
    groupItemsByShop[shopId].push(item)

})
const shopOrders=await Promise.all( Object.keys(groupItemsByShop).map(async(shopId)=>{
     const shop= await Shop.findById(shopId).populate("owner")
     if(!shop){
        return res.status(400).json({message:"shop not found"})
     }
     const items=groupItemsByShop[shopId]
    const subtotal = items.reduce(
  (sum, i) => sum + (Number(i.price || 0) * Number(i.quantity || 0)),
  0
);
     return {
        shop:shop._id,
        owner:shop.owner._id,
        subtotal,
        shopOrderItems:items.map((i)=>({
            item:i.id,
            price:i.price,
            quantity:i.quantity,
            name:i.name
        }))

     }
    }
))

const newOrder=await Order.create({
    user:req.userId,
    paymentMethod,
    deliveryAddress,
    totalAmount,
    shopOrders
})
await newOrder.populate("shopOrders.shopOrderItems.item","name image price")
await newOrder.populate("shopOrders.shop","name")
return res.status(201).json(newOrder)
    }
    catch(error){
return res.status(500).json({message:`place order error ${error}`})
    }
}


// {
//     shopId1:[
//         item1,
//         item3
//     ],
//     shopId2:[
//         item2
//     ]
// }


export const getMyOrders=async(req,res)=>{
    try{
      const user=await User.findById(req.userId)
      if(user.role=="user"){
      const orders=await Order.find({user:req.userId})
      .sort({createdAt:-1})
      .populate("shopOrders.shop","name",)
      .populate("shopOrders.owner","fullName email mobile")
      .populate("shopOrders.shopOrderItems.item","name image price")
     

    return res.status(200).json(orders)}
    else if(user.role=="owner"){
         const orders = await Order.find({"shopOrders.owner":req.userId})
  .sort({createdAt:-1})
  .populate("shopOrders.shop","name")
  .populate("user","fullName email mobile")
  .populate("shopOrders.shopOrderItems.item","name image price")

      const filteredOrders=orders.map((order)=>({
  _id:order._id,
  paymentMethod:order.paymentMethod,
  user:order.user,
  shopOrders:order.shopOrders.filter(o=>o.owner._id==req.userId),
  createdAt:order.createdAt,
  deliveryAddress:order.deliveryAddress
}))
    return res.status(200).json(filteredOrders)
    
    }
    }
    catch(error){
     return res.status(500).json({message:`get User order error ${error}`})
    }
}

export const updateOrderStatus=async(req,res)=>{
    try{
       const {orderId,shopId}=req.params
       const {status}=req.body
       const order=await Order.findById(orderId)
       const shopOrder=order.shopOrders.find(o=>o.shop==shopId)
       if(!shopOrder){
        return res.status(400).json({message:"shop order not found"})
       }
       shopOrder.status=status
      
       if(status=="out of delivery" || !shopOrder.assignment){
        const {longitude,latitude}=order.deliveryAddress
        const nearByDeliveryBoys=await User.find({
            role:"deliveryBoy",
            location:{
                $near:{
                    $geometry:{type:"Point",coordinates:[Number(longitude),Number(latitude)]},
                    $maxDistance:5000
                }
            }
        })
        const nearByIds=nearByDeliveryBoys.map(b=>b._id)
        const busyIds=await DeliveryAssignment.find({
            assignedTo:{$in:{nearByIds}},
            status:{$nin:["broadcasted","completed"]}
        }).distinct("assignedTo")



        const busyIdSet=new Set(busyIds.map(id=>String(id)))
       const availableBoys= nearByDeliveryBoys.filter(b=>!busyIdSet.has(String(b._id)))
       const candidates=availableBoys.map(b=>b._id)

          

       const deliveryAssignment=await DeliveryAssignment.create({
        
       })
       }








       await shopOrder.save()
       await order.save()
       return res.status(200).json(shopOrder.status)
    }
   catch (error) {
  console.log(error);
  return res.status(500).json({
    message: error.message,
  });
}
}

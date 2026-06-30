import Shop from "../models/shop.models.js";
import Order from "../models/order.models.js";
import User from "../models/user.models.js";
import DeliveryAssignment from "../models/deliveryAssignment.models.js";

/* =========================
   PLACE ORDER
========================= */
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    if (
      !deliveryAddress?.text ||
      !deliveryAddress?.latitude ||
      !deliveryAddress?.longitude
    ) {
      return res.status(400).json({ message: "send complete deliveryAddress" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");

        if (!shop) return null;

        const items = groupItemsByShop[shopId];

        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders: shopOrders.filter(Boolean),
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // USER SIDE
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    }

    // OWNER SIDE
    if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.filter(
          (o) => o.owner?.toString() === req.userId.toString()
        ),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId
    );

    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;
  

    let deliveryBoysPayload = [];

    /* =========================
       DELIVERY LOGIC
    ========================= */
    if (status === "out of delivery"  && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map(id =>id.toString()));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message: "order updated but no delivery boys available",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      shopOrder.assignment = deliveryAssignment._id;
      shopOrder.assignedDeliveryBoy = null;

      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await order.save();
const updatedShopOrder =order.shopOrders.find(
      (o) => o.shop.toString() === shopId
    );
await order.populate("shopOrders.shop","name")
await order.populate("shopOrders.assignedDeliveryBoy","fullName email mobile")
    /* =========================
       FRESH DATA FETCH (IMPORTANT)
    ========================= */
   
    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


export const getDeliveryBoyAssignment=async(req,res)=>{
  try {
    const deliveryBoyId=req.userId
    // agr jo brodcasted delivery boys jo kisi owner ne bhej  h usme is delivey boy ki id h wo find krna h hume
    const assignments=await DeliveryAssignment.find({
      broadcastedTo:deliveryBoyId,
      status:"broadcasted"
    })
    .populate("order")
    .populate("shop")
    const formated=assignments.map(a=>({
      assignmentId:a._id,
      orderId:a.order._id,
      shopName:a.shop.name,
      deliveryAddress:a.order.deliveryAddress,
      items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.shopOrderItems || [],
      subtotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subtotal,

    }))
    return res.status(200).json(formated)
  } catch (error) {
     return res.status(500).json({ message: `get Assignment error ${error}` });
  }
}
export const acceptOrder=async(req,res)=>{
  try {
    const {assignmentId}=req.params
    const assignment=await DeliveryAssignment.findById(assignmentId)
    if(!assignment){
      return res.status(400).json({message:"Assignment not found"})
    }
    if(assignment.status!=="broadcasted"){
      return res.status(400).json({message:"Assignment is expired"})
    }
    const alreadyAssigned=await DeliveryAssignment.findOne({
      assignedTo:req.userId,
      status:{$nin:["broadcasted","completed"]}
    })
    if(alreadyAssigned){
      return res.status(400).json({message:"You are already assigned to another order"})
    }
    assignment.assignedTo=req.userId
    assignment.status="assigned"
    assignment.acceptedAt=new Date()
    await assignment.save()
    const order=await Order.findById(assignment.order)
    if(!order){
      return res.status(400).json({message:"order not found"})
    }
    const shopOrder=order.shopOrders.id(assignment.shopOrderId)
    shopOrder.assignedDeliveryBoy=req.userId
    await order.save()
    
    return res.status(200).json({
message:"Order Accepted"
    })
  } catch (error) {
    return res.status(500).json({ message: `Accept Order Error ${error}` });
  }
}
export const getCurrentOrder=async(req,res)=>{
  try {
    const assignment=await DeliveryAssignment.findOne({
      assignedTo:req.userId,
      status:"assigned"
    })
    .populate("shop","name")
    .populate("assignedTo","fullName email mobile location")
    .populate({
      path:"order",
      populate:[{
        path:"user",
        select:"fullName email location mobile"
      }],
      
    })
if(!assignment){
  return res.status(400).json({message:"assignent not found"})
}
if(!assignment.order){
  return res.status(400).json({message:"order not found"})
}
const shopOrder=assignment.order.shopOrders.find(so=>String(so._id)==String(assignment.shopOrderId))
if(!shopOrder){
  return res.status(400).json({message:"shop order not found"})
}
let deliveryBoyLocation={lat:null,lon:null}
if(assignment.assignedTo.location.coordinates.length==2){
deliveryBoyLocation.lat=assignment.assignedTo?.location?.coordinates[1]
deliveryBoyLocation.lon=assignment.assignedTo?.location?.coordinates[0]}

let customerLocation={lat:null,lon:null}
if(assignment.order.deliveryAddress){
 customerLocation.lat=assignment.order?.deliveryAddress?.latitude
 customerLocation.lon=assignment.order?.deliveryAddress?.longitude}

 return res.status(200).json({
  _id:assignment.order._id,
  user:assignment.order.user,
  shopOrder,
  deliveryAddress:assignment.order.deliveryAddress,
  deliveryBoyLocation,
  customerLocation
 })
  } catch (error) {
    return res.status(500).json({ message: `Current Order Error ${error}` });
  }
}

export const getOrderById=async(req,res)=>{
  try {
    const {orderId}=req.params
    const order=await Order.findById(orderId)
    .populate("user")
    .populate({
      path:"shopOrders.shop",
      model:"Shop"
    })
    .populate({
      path:"shopOrders.assignedDeliveryBoy",
      model:"User"
    })
    .populate({
      path:"shopOrders.shopOrderItems.item",
      model:"Item"
    })
    .lean()

    if(!order){
      return res.status(400).json({message:"Order not found"})
    }
    return res.status(200).json(order)
  } catch (error) {
     return res.status(500).json({ message: `get by id Order Error ${error}` });
  }
}
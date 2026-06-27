import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice.js";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from '../App.jsx';
import { addMyOrder } from "../redux/userSlice.js";
function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);

  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
const { cartItems,totalAmount } = useSelector((state) => state.user);

  const { location, address } = useSelector((state) => state.map);

const deliveryFee=totalAmount>500?0:40
const AmountWithDeliveryFee=totalAmount+deliveryFee

  useEffect(() => {
    console.log("Redux Location:", location);
  }, [location]);

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`,
      );

      dispatch(setAddress(result?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  const getlatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };
  const handlePlaceOrder=async()=>{
    try{
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount,
        cartItems
      },{withCredentials:true})

      dispatch(addMyOrder(result.data))
      navigate("/order-placed")
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    setAddressInput(address || "");
  }, [address]);
  const onDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();

    console.log("Dragged:", lat, lng);

    dispatch(
      setLocation({
        lat,
        lon: lng,
      }),
    );

    getAddressByLatLng(lat, lng);
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-10"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <IoLocationSharp className="text-[#ff4d2d]" />
            Delivery Location
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Delivery Address"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
              }}
            />

            <button
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
              onClick={getlatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="w-full h-full"
                center={[location?.lat ?? 26.9124, location?.lon ?? 75.7873]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap location={location} />

                <Marker
                  position={[
                    location?.lat ?? 26.9124,
                    location?.lon ?? 75.7873,
                  ]}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      console.log("drag ended");
                      onDragEnd(e);
                    },
                  }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
        <section> 
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod == "cod" ? "border-[#ff4d2d] bg-orange-50 shadow " : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full"><MdDeliveryDining  className="text-green-600 texl-xl"/></span>
<div >
  <p className="font-medium text-gray-800">
Cash On Delivery
  </p>
  <p className="text-xs text-gray-500">
Pay when your food arrived
  </p>
</div>
            </div>
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod == "online" ? "border-[#ff4d2d] bg-orange-50 shadow " : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100"><FaMobileScreenButton className="text-purple-700 text-lg"/></span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"><FaCreditCard className="text-blue-700 text-lg" /></span>
              <div>
                <p className="font-medium text-gray-800">UPI / Credit / Debit Card</p>
                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
{cartItems.map((item, index) => (
  <div
    key={index}
    className="text-sm flex justify-between text-gray-700"
  >
    <span>
      {item.name} x {item.quantity}
    </span>
    <span>
      ₹{item.price * item.quantity}
    </span>
  </div>
))}
<hr  className="border-gray-200 my-2" />
<div className="flex justify-between font-medium text-gray-700">
  <span>
    Subtotal
  </span>
  <span>{totalAmount}</span>
</div>
<div className="flex justify-between text-gray-700">
  <span>Delivery Fee</span>
  <span>{deliveryFee==0?"Free":deliveryFee}</span>
</div>
<div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
  <span>Total</span>
  <span>{AmountWithDeliveryFee}</span>
</div>

          </div>
        </section>
        <button className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold" onClick={handlePlaceOrder}>
          {paymentMethod=="cod"?"Place Order":"Pay &  Place Order"}
          </button>
      </div>
    </div>
  );
}

export default CheckOut;

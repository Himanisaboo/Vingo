import React from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";

function Home() {
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      {(userData?.role === "user" || userData?.role === "owner") && <Nav />}

      <div className="w-full min-h-screen pt-[100px]">
        {userData?.role === "user" && <UserDashboard />}

        {userData?.role === "owner" && <OwnerDashboard />}

        {userData?.role === "deliveryBoy" && <DeliveryBoy />}
      </div>
    </>
  );
}

export default Home;
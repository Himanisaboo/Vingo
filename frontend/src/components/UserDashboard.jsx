import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
function UserDashboard() {
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
const {currentCity,shopsInMyCity,itemsInMyCity,searchItems}=useSelector(state=>state.user)
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
const [updatedItemsList,setUpdatedItemsList] = useState([]);
const navigate=useNavigate()

const handleFilterByCategory=(category)=>{
  if(category==="All"){
    setUpdatedItemsList(itemsInMyCity)
  }
  else{
    const filteredList=itemsInMyCity.filter(item=>item.category===category)
    setUpdatedItemsList(filteredList)
  }
}
useEffect(()=>{
  setUpdatedItemsList(itemsInMyCity)
},[itemsInMyCity])
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;

    if (element) {
      setLeftButton(element.scrollLeft > 0);

      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
  const cateElement = cateScrollRef.current;
  const shopElement = shopScrollRef.current;

  const handleCateScroll = () => {
    updateButton(
      cateScrollRef,
      setShowLeftCateButton,
      setShowRightCateButton
    );
  };

  const handleShopScroll = () => {
    updateButton(
      shopScrollRef,
      setShowLeftShopButton,
      setShowRightShopButton
    );
  };

  handleCateScroll();
  handleShopScroll();

  cateElement?.addEventListener("scroll", handleCateScroll);
  shopElement?.addEventListener("scroll", handleShopScroll);

  return () => {
    cateElement?.removeEventListener("scroll", handleCateScroll);
    shopElement?.removeEventListener("scroll", handleShopScroll);
  };
}, []);
  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
{searchItems && searchItems.length > 0 && (
  <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
    <h1 className="text-gray-800 text-2xl sm:text-3xl  font-semibold border-b border-gray-300 pb-2">
      Search Results
    </h1>
    <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
      {searchItems.map((item) => (
        <FoodCard key={item._id} data={item} />
      ))}
    </div>
  </div>
)}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            ref={cateScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2"
          >
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)} />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
</div>




        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
<h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {currentCity}
        </h1>
         <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            ref={shopScrollRef}
            className="w-full flex overflow-x-auto gap-4 pb-2"
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image?.url || shop.image} key={index} onClick={() => navigate(`/shop/${shop._id}`)}/>
            ))}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
        </div>
      
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
<h1 className="text=gray-800 text-2xl sm:text-3xl">
  Suggested Food Items
</h1>
<div className="w-full h-auto flex flex-wrap gap-[20px] justify-center"> 
{updatedItemsList?.map((item, index) => (
  <FoodCard key={index} data={item} />
))}
</div>
      </div>
    </div>
  );
}

export default UserDashboard;
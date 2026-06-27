import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentAddress, setCurrentCity ,setCurrentState} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice.js";

function useGetCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          dispatch(setLocation({lat:latitude,lon:longitude}))
          const apiKey = import.meta.env.VITE_GEOAPIKEY;

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          );
console.log(result.data)
          dispatch(setCurrentCity(result?.data?.results[0]?.city || result?.data?.results[0]?.county ));
          dispatch(setCurrentState(result?.data?.results[0]?.state))
          dispatch(
  setCurrentAddress(
    result?.data?.results[0]?.address_line2 ||
    result?.data?.results[0]?.address_line1
  )
)
dispatch(setAddress(result.data.results[0].address_line2))
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return null;
}

export default useGetCity;
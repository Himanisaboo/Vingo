import React, {useEffect} from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice'

import { useRouteLoaderData } from 'react-router-dom'
function useGetMyOrders() {
  const dispatch = useDispatch();
   const {userData}=useSelector(state=>state.user)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          {
            withCredentials: true,
          }
        );

        dispatch(setMyOrders(result.data));
        console.log(result.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrder();
  }, [userData]);
}

export default useGetMyOrders;
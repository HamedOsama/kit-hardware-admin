"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// import OrderCard from "../../cards/OrderCard";

import Loader from "@components/loaders/Loader";
import NotFoundText from "@components/NotFoundText/NotFoundText";
import SmallLoader from "@components/loaders/SmallLoader";
import axios from "axios";
import env from "../../API/ApiUrl";
import OrderCard from "@components/OrderCard/OrderCard";
import { IOverviewCard } from "../../interfaces/IOverviewCard";

const OrdersList = () => {
  const [isLoading , setIsLoading] = useState<boolean>(true)
  const [length, setLength] = useState<number>(0);
  const [orders, setOrders] = useState<IOverviewCard[]>([]);
  const getOrderHistory = useCallback( async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${env.API_URL}/orders`);
      setOrders(res.data.body)
      setLength(res.data.totalLength)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }
  , [])
  useEffect(() => {
    getOrderHistory()
  }, [])
  if (isLoading) {
    return <Loader />;
  }

  if (length === 0) {
    return <NotFoundText>No Order History</NotFoundText>;
  }

  return (
    <div className="mb-5">
      {
        orders?.map((order, index) => {
          return (
            <Fragment key={index}>
              <OrderCard item={order} itemType="order" />
            </Fragment>
          )
        })
      }
      
    </div>
  );
};

export default OrdersList;

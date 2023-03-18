import NotFoundText from '@components/NotFoundText/NotFoundText';
import OrderCard from '@components/OrderCard/OrderCard';
import Loader from '@components/loaders/Loader';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { IOverviewCard } from '../../interfaces/IOverviewCard';
import env from '../../API/ApiUrl';

const MaintenancesList = () => {
  const [isLoading , setIsLoading] = useState<boolean>(true)
  const [length, setLength] = useState<number>(0);
  const [maintenances, setMaintenances] = useState<IOverviewCard[]>([]);
  const getOrderHistory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${env.API_URL}/maintenances`);
      setMaintenances(res.data.body)
      setLength(res.data.totalLength)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')  
    }
  }
  useEffect(() => {
    getOrderHistory()
  }, [])
  if (isLoading) {
    return <Loader />;
  }

  if (length === 0) {
    return <NotFoundText>No Maintenance Found </NotFoundText>;
  }

  return (
    <div className="mb-5">
      {
        maintenances?.map((item, index) => {
          return (
            <Fragment key={index}>
              <OrderCard item={item}  itemType='maintenance' />
            </Fragment>
          )
        })
      }
      
    </div>
  );
}

export default MaintenancesList
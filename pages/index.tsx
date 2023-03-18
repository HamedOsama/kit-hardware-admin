import React from 'react'

import EngineeringIcon from '@mui/icons-material/Engineering';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import DashboardLayout from '@components/layouts/DashboardLayout';
import InfoCard from '@components/InfoCard/InfoCard';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import env from '../API/ApiUrl';

axios.defaults.withCredentials = true;
const index = ({ stats }) => {
  return (
    <div>
      <DashboardLayout >
        <div className="container max-md:p-2 mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 ">
          <InfoCard title='Products' link='/products' value={stats?.products || '0'} Icon={<InventoryIcon className="text-green-400" />} bg='bg-green-300' />
          <InfoCard title='Orders' link='/orders' value={stats?.orders || '0'} Icon={<ShoppingCartCheckoutRoundedIcon className="text-blue-400" />} bg='bg-blue-300' />
          <InfoCard title='Maintenances' link='/maintenances' value={stats?.maintenances || '0'} Icon={<EngineeringIcon className="text-yellow-400" />} bg='bg-yellow-300' />
        </div>
      </DashboardLayout>
    </div>
  )
}

export default index


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const stats = await axios.get(`${env.API_URL}/admin/stats`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    console.log(stats.data)
    return {
      props: {
        stats: stats.data.body
      }, // will be passed to the page component as props
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    };
  }
}
import React from 'react'

import EngineeringIcon from '@mui/icons-material/Engineering';
import DashboardLayout from '@components/layouts/DashboardLayout';
import InfoCard from '@components/InfoCard/InfoCard';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import env from '../API/ApiUrl';

axios.defaults.withCredentials = true;
const index = () => {
  return (
    <div>
      <DashboardLayout >
        <div className="container max-md:p-2 mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 ">
          <InfoCard title='Total Maintenances' value='100' Icon={<EngineeringIcon className="text-green-400" />} bg='bg-green-400' />
        </div>
      </DashboardLayout>
    </div>
  )
}

export default index


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await axios.get(`${env.API_URL}/admin/auth`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    return {
      props: {}, // will be passed to the page component as props
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
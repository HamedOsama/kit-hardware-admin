import { useEffect } from "react";
import OrdersList from "@components/OrdersList/OrdersList";
import UserTabs from "@components/UserTabs/UserTabs";
import MainLayout from "@components/layouts/MainLayout";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useSelector } from "react-redux";
import env from "../../API/ApiUrl";
import MaintenancesList from "@components/MaintenancesList/MaintenancesList";

interface Props {
  query: string;
}
const UserHeadSection = ({ query }: Props) => {
  console.log(query)
  const [tab, setTab] = useState<number>(query === "maintenance" ? 1 : 0);
  const { user } = useSelector((state: any) => state.user);
  
  useEffect(() => {
    setTab(query === "maintenance" ? 1 : 0);
  }, [query]);

  const CurrentDisplay = () => {
    switch (tab) {
      case 0:
        return <OrdersList />;
      case 1:
        return <MaintenancesList />;
      default:
        return <></>;
    }
  };
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl w-full">
        <div className="bg-gradient-to-bl from-slate-300 border-t border-x border-zinc-300 pt-14 pb-4 sm:pl-10 pl-4 mt-4 rounded-t-2xl">
          <div
            className={
              "mb-3 rounded-full h-20 w-20 flex flex-row items-center justify-center overflow-hidden" +
              !user?.image && "bg-purple-400"
            }
          >
            {/* <UserAvatar
          user={user}
          fallbackProps={{
            delayMs: 600,
          }}
        /> */}
          </div>
          <p className="text-lg font-medium text-gray-600">{user?.name}</p>
          <p className="text-[14px] text-gray-600">{user?.email}</p>
        </div>
        <UserTabs tab={tab} setTab={setTab} />
        <CurrentDisplay />
      </div>
    </MainLayout>
  );
};

export default UserHeadSection;


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { query } = context
    await axios.get(`${env.API_URL}/users/auth`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    return {
      props: {
        query: query?.display || "orders"
      }, // will be passed to the page component as props
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

}

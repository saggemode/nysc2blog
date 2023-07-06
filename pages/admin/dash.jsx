import Link from "next/link";
import useSWR from "swr";
import React, { Fragment, useState } from "react";

// import AdminLayout from "@/components/Layout/AdminLayout";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Order from "../../components/Order/Order";
import { useSession } from "next-auth/react";
import Head from "next/head";
import {
  ArchiveBoxArrowDownIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ProfileContent from "@/components/Profile/ProfileContent";
// import ProfileSidebar from "./profile/ProfileSidebar";
// import ProfileContent from "./profile/ProfileContent";

const Dashboard = () => {
  const { data: session, loading } = useSession();
  const [active, setActive] = useState(1);
  const { data: orders, error } = useSWR(
    !loading && session?.user.Isadmin ? "/api/admin/active-orders" : null
  );

  if (error) {
    console.error(error);
  }
  return (
    <>
      <div>
        {loading ? (
          // <Loader />
          <h5>loading</h5>
        ) : (
          <>
            <Head>
              <title>Radon | Dashboard</title>
            </Head>
            <div>
              <div className="grid  md:grid-cols-4 md:gap-5">
                <div>
                  <ProfileSidebar active={active} setActive={setActive} />
                </div>

                <div className="md:col-span-3 w-full" >
                  {/* <h1 className="mb-4 text-xl">Admin Dashboard</h1> */}

                  {/* <div>
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="card m-5 p-5">
                          <p className="text-3xl">${summary.ordersPrice} </p>
                          <p>Sales</p>
                          <Link href="/admin/orders">View sales</Link>
                        </div>
                        <div className="card m-5 p-5">
                          <p className="text-3xl">{summary.ordersCount} </p>
                          <p>Orders</p>
                          <Link href="/admin/orders">View orders</Link>
                        </div>
                        <div className="card m-5 p-5">
                          <p className="text-3xl">{summary.productsCount} </p>
                          <p>Products</p>
                          <Link href="/admin/products">View products</Link>
                        </div>
                        <div className="card m-5 p-5">
                          <p className="text-3xl">{summary.usersCount} </p>
                          <p>Users</p>
                          <Link href="/admin/users">View users</Link>
                        </div>
                      </div>
                      <h2 className="text-xl">Sales Report</h2>
                      <Bar
                        options={{
                          legend: { display: true, position: "right" },
                        }}
                        data={data}
                      />

                      <div className="shadow-lg rounded-lg overflow-hidden">
                        <div className="py-3 px-5 bg-gray-50">Bar chart</div>
                        <canvas className="p-10" id="chartBar"></canvas>
                      </div>
                    </div> */}
                  <ProfileContent active={active} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="heightFixAdmin bg-gray-100 py-10 md:px-6">
        <div className="max-w-screen-xl mx-auto bg-white  shadow rounded-md my-6">
          <div className="flex flex-col md:p-8  p-6  bg-white gap-6">
            <h1 className="sm:text-2xl text-xl  font-semibold border-b-2 border-gray-200 pb-4 text-gray-700">
              Dashboard
            </h1>
            <div className="flex gap-4 sm:gap-6 lg:gap-8  text-blue-light font-medium flex-wrap sm:text-base text-sm">
              <Link href="/admin/products">
                <div className="dashboard-link flex items-center gap-1">
                  <ArchiveBoxArrowDownIcon className="w-4" />
                  <span>Products</span>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="dashboard-link flex items-center gap-1">
                  <UsersIcon className="w-4" />
                  <span>Users</span>
                </div>
              </Link>
              <Link href="/admin/add-product">
                <div className="dashboard-link flex items-center gap-1">
                  <PlusIcon className="w-4" />
                  <span>Product</span>
                </div>
              </Link>
              <Link href="/admin/add-category">
                <div className="dashboard-link flex items-center gap-1">
                  <PlusIcon className="w-4" />
                  <span>Category</span>
                </div>
              </Link>
            </div>
            <div className="lg:mt-10 sm:mt-8 mt-6">
              <h4 className="sm:text-xl text-lg font-semibold">
                Active Orders
              </h4>
            </div>
            <div>
              <h2 className="font-medium text-lg  my-2 text-blue-light">
                {orders ? (
                  <>
                    <span className="font-semibold text-xl mr-2">
                      {orders?.length}
                    </span>
                    Orders
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </h2>
              {orders ? (
                orders?.length ? (
                  <div className="mt-5 space-y-6">
                    {orders.map(
                      ({
                        _id,
                        id,
                        amount_total,
                        items,
                        timestamp,
                        order_status,
                      }) => (
                        <Order
                          key={`order-${_id}`}
                          id={id}
                          _id={_id}
                          amount_total={amount_total / 100}
                          timestamp={timestamp}
                          items={items}
                          status={order_status?.current?.status}
                          admin
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center mt-16 sm:w-auto w-3/4 mx-auto sm:max-w-xs ">
                    <Image
                      src="/img/empty.svg"
                      width={300}
                      height={300}
                      alt=""
                      objectFit="contain"
                    />
                  </div>
                )
              ) : (
                <Skeleton count={12} />
              )}
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Dashboard;

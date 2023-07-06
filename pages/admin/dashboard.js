import Link from "next/link";
import useSWR from "swr";
import React, { Fragment, useState } from "react";

import AdminLayout from "@/components/Layout/AdminLayout";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Order from "../../components/Order/Order";
import { useSession } from "next-auth/react";


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
  <AdminLayout></AdminLayout>
  );
};

export default Dashboard;

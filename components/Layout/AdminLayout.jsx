import Link from "next/link";

import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import Sidebar from "./SideBar";


export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-auto h-screen">
        <Sidebar />
        <div className="grow">
       
          <div className="m-5">{children}</div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";

import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { BsArrowLeftCircle } from "react-icons/bs";
import { AiFillPieChart } from "react-icons/ai";
import { SiFuturelearn } from "react-icons/si";
import { SiOpenaccess } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import { RxHamburgerMenu } from "react-icons/rx";
import { HamburgerButton } from "../HamburgerMenuButton";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  const menuItems = [
    { title: "dashboard", path: "/", icon: <MdOutlineDashboard /> },
    { title: "user", path: "/admin/admin-user", icon: <AiOutlineUser /> },
    { title: "products", path: "/admin/admin-products", icon: <FiMessageSquare /> },
    {
      title: "analytics",
      path: "/",
      icon: <TbReportAnalytics />,
      margin: true,
    },
    { title: "File Manager", path: "/", icon: <FiFolder /> },
    { title: "Cart", path: "/", icon: <FiShoppingCart /> },
    { title: "Saved", path: "/", icon: <AiOutlineHeart />, margin: true },
    { title: "Setting", path: "/", icon: <RiSettings4Line /> },
    { title: "Signin", path: "/logout", icon: <SiOpenaccess />, gap: "true" },
  ];

  return (
    <>
      <div
        className={`${
          open ? "w-60" : "w-fit"
        } hidden sm:block relative h-screen duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
      >
        <BsArrowLeftCircle
          className={`${
            !open && "rotate-180"
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />

        <Link href="/">
          <div className={`flex ${open && "gap-x-4"} items-center`}>
            <img src={"Logo"} alt="" className="pl-2" />
            {open && (
              <span className="text-xl font-medium whitespace-nowrap dark:text-white">
                Goal Quest
              </span>
            )}
          </div>
        </Link>

        <ul className="pt-6">
          {menuItems.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <li
                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                       ${menu.gap ? "mt-9" : "mt-2"} ${
                  router.pathname === menu.path &&
                  "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span className="text-2xl">{menu.icon}</span>
                <span
                  className={`${
                    !open && "hidden"
                  } origin-left duration-300 hover:block`}
                >
                  {menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>

      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? "flex" : "hidden"
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {menuItems.map((menu, index) => (
            <Link
              href={menu.path}
              key={index}
              onClick={() => setMobileMenu(false)}
            >
              <span
                className={` ${
                  router.pathname === menu.path &&
                  "bg-gray-200 dark:bg-gray-700"
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

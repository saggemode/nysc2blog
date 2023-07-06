import React, { useState } from "react";
import Image from "next/image";
import { Bars4Icon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Search from "../Search/Search";
import SideBarMenu from "../SideBarMenu/SideBarMenu";
import { selectItems } from "@/slices/CartSlice";
import Headersm from "./Headersm";

const HeaderMobile = () => {
  const router = useRouter();
  const items = useSelector(selectItems);
  const [showSideBar, setShowBar] = useState(false);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-30 bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  glassmorphism px-6 md:hidden block py-4 transition-all">
        <div className="flex items-center w-full justify-between  mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <Bars4Icon className="w-8" onClick={() => setShowBar(true)} />
            </div>
            <div className="flex items-center">
              <Image
                src="/img/aa.png"
                alt="RADON"
                className="cursor-pointer"
                width={40}
                height={25}
                onClick={() => router.push("/")}
              />
            </div>
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCartIcon className="xl:w-10 w-9 link" />
            <div className="absolute -top-2 -right-1 rounded-full text-white bg-blue-light p-1 flex items-center justify-center text-xs font-extrabold">
              {items?.length}
            </div>
          </div>
        </div>

        <div>
          <Search />
        </div>
      </header>

      <div
        className={`z-40 fixed inset-y-0 left-0 overflow-hidden transition-all duration-300  shadow-2xl  ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
        }
        `}
      >
        <SideBarMenu closeSideBar={() => setShowBar(false)} />

        <Headersm />
      </div>
    </>
  );
};

export default HeaderMobile;

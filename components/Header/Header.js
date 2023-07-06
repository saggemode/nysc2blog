import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Search from "../Search/Search";
import Dropdown from "../Dropdown/Dropdown";
import { selectItems } from "@/slices/CartSlice";
import DarkModeSwitch from "../DarkModeSwitch";
import Link from "next/link";
import Navbar from "./Navbar";
import styles from "../../styles/styles";
import Headersm from "./Headersm";

const Header = ({ activeHeading }) => {
  const router = useRouter();
  const { data: session, loading } = useSession();
  const items = useSelector(selectItems);
  const [dropDown, setDropDown] = useState(false);

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-gray-100 dark:bg-gray-900 border-yellow-500  dark:border-yellow-400 shadow dark:shadow-2  glassmorphism px-6 md:block hidden transition-all duration-500">
      <div className="flex items-center w-full max-w-screen-xl py-2 xl:space-x-16 lg:space-x-12  space-x-7  mx-auto">
        <div className="flex items-center">
          <Image
            src="/img/aa.png"
            alt="Onye Oghe"
            className="cursor-pointer"
            width={50}
            height={50}
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex-grow">
          <Search />
        </div>
    
        <div className="flex items-center xl:space-x-12  lg:space-x-10 space-x-7  font-medium  lg:text-base text-sm">
          {!loading ? (
            !session ? (
              <span className="link">
                <Link href="/login">Login</Link>
              </span>
            ) : (
              <span
                className="relative"
                onClick={() => setDropDown((value) => !value)}
              >
                <span className="flex items-center cursor-pointer">
                  <Image
                    src={session?.user?.image || "/img/profile_pic.svg"}
                    loading="lazy"
                    alt=""
                    width="24"
                    height="24"
                    className="object-contain w-10 h-10 rounded-full mr-1 hover:shadow-md"
                  />
                  <ChevronDownIcon className="lg:w-6 w-4" />
                </span>
                {dropDown && (
                  <div className="absolute top-14 right-1">
                    <Dropdown hideDropDown={() => setDropDown(false)} />
                  </div>
                )}
              </span>
            )
          ) : (
            <Skeleton circle={true} width={40} height={40} />
          )}
          <span className="link" onClick={() => router.push("/orders")}>
            Orders
          </span>
          <span className="link" onClick={() => router.push("/about")}>
            About
          </span>
          {/* <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div> */}
          <span className="link">
            <DarkModeSwitch />
          </span>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => router.push("/cart")}
        >
          <ShoppingCartIcon className="xl:w-10 lg:w-9 w-8 link" />
          <div className="absolute -top-2 -right-1 rounded-full text-white bg-blue-light p-1 flex items-center justify-center text-xs font-extrabold">
            {items?.length}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

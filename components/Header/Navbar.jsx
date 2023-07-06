import React from "react";
import Link from "next/link";
import { navItems } from "@/data/data";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  return (
    <div className={`${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={index}>
            <Link
              href={`${i.url}`}
              className={`${
                active === index + 1 ? "text-[#17dd1f]" : "text-[#fff]"
              } font-[500] px-6 cursor-pointer}`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;

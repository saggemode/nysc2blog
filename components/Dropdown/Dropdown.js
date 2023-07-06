import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import onClickOutside from "react-onclickoutside";

function Dropdown({ hideDropDown }) {
  const { data: session, loading } = useSession();
  const router = useRouter();
  Dropdown.handleClickOutside = hideDropDown;
  return (
    <div className="font-medium w-36 bg-white  dark:bg-gray-800 dark:border-gray-700 text-sm rounded shadow overflow-hidden border border-gray-100">
        {session.user.isAdmin && (
        <div
          className="dropDownOption border-b border-gray-200 hover:bg-sky-700"
          onClick={() => router.push("/admin/dashboard")}
        >
          Dashboard
        </div>
      )}
      <div
        className="dropDownOption border-b border-gray-200 hover:bg-sky-700"
        onClick={() => router.push("/profile")}
      >
        Profile
      </div>

      <div
        className="dropDownOption border-b border-gray-200 hover:bg-sky-700"
        onClick={() => router.push("/orders")}
      >
        Orders
      </div>
      <div
        className="dropDownOption border-b border-gray-200 hover:bg-sky-700"
        onClick={() => router.push("/about")}
      >
        Contact
      </div>
      <div
        className="dropDownOption hover:bg-sky-700"
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </div>
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);
import Currency from "react-currency-formatter";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";
import { useState } from "react";

function UserInfo({
  _id,
  name,
  email,
  isAdmin,
  image,
  border,
  removeFromSearchResults,
}) {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const deleteProduct = (_id) => {
    setDisabled(true);
    axios
      .post("/api/admin/delete-product", { _id })
      .then(() => {
        NormalToast("Product deleted");
        removeFromSearchResults(_id);
        setDisabled(false);
      })
      .catch((err) => {
        NormalToast("Something went wrong", true);
        console.error(err);
        setDisabled(false);
      });
  };

  return (
    <div
      className={`flex sm:flex-row flex-col-reverse w-full my-4 text-sm text-gray-700 py-6 ${
        border ? "border-b border-gray-200" : ""
      } sm:justify-between gap-6`}
    >
      <div className="space-y-2">
        <div className="font-semibold text-base capitalize">{name}</div>
        <div className="text-blue-light capitalize">{email}</div>
        {/* <p className="text-gray-500 lg:text-sm text-xs">{isAdmin}</p> */}
        <div>
          <p className="font-semibold">
            <span className="font-normal">Admin - </span>
            {isAdmin ? "YES" : "NO"}
          </p>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button
            className={`button py-2 xxs:px-10 px-8 ${
              disabled ? "opacity-50" : ""
            }`}
            onClick={() => router.push(`/admin/update-user/${_id}`)}
            disabled={disabled}
          >
            Update
          </button>
          <button
            className={`button-red py-2 xxs:px-10 px-8 ${
              disabled ? "opacity-50" : ""
            }`}
            onClick={() => deleteProduct(_id)}
            disabled={disabled}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="sm:mx-0 sm:ml-6 min-w-max  mx-auto my-auto">
        <Image src={image} width={120} height={120} alt="" />
      </div>
    </div>
  );
}

export default UserInfo;

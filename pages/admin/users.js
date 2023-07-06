import React, { Fragment, useState } from "react";
import db from "@/util/db";
import getUsers from "@/util/getUsers";
import Head from "next/head";
import User from "@/models/User";
import { DataGrid } from "@mui/x-data-grid";
import { EditNotifications } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";
import {
  ArchiveBoxArrowDownIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const Users = (props) => {
  const { users, error } = getUsers(props?.users);
  const [disabled, setDisabled] = useState(false);

  if (error) {
    console.error(error);
  }

  const deleteUser = async (userId) => {
    setDisabled(true);
    await axios
      .delete(`/api/admin/users/${userId}`)
      .then(() => {
        NormalToast("User deleted");
        setDisabled(false);
      })
      .catch((err) => {
        NormalToast("Something went wrong", true);
        console.error(err);
        setDisabled(false);
      });
  };

  const columns = [
    // { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "isAdmin",
      headerName: "IsAdmin",
      // type: "number",
      minWidth: 150,
      flex: 0.3,

      cellClassName: (params) => {
        {
          params.isAdmin ? "YES" : "NO";
        }
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link href={`/admin/user/${params.row._id}`}>
              <EditNotifications />
            </Link>

            <Button onClick={() => deleteUser(params.row._id)}>
              {/* <DeleteIcon /> */}
              delete
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        _id: item._id,
        isAdmin: item.isAdmin,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <>
      <Head>
        <title>Radon | Users</title>
      </Head>

      <div className="heightFixAdmin px-6 lg:py-20 sm:py-16 py-12">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="lg:text-4xl sm:text-3xl text-2xl  font-bold mb-6 ">
            Users
          </h2>

          <div className="flex gap-4 sm:gap-6 lg:gap-8  text-blue-light font-medium flex-wrap sm:text-base text-sm">
            <Link href="/admin/products">
              <div className="dashboard-link  flex items-center gap-1">
                <ArchiveBoxArrowDownIcon className="w-4" />
                <span>Products</span>
              </div>
            </Link>
            <Link href="/admin/users">
              <div className="dashboard-link bg-blue-light text-white flex items-center gap-1">
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
          <div className="py-2">
            <input
              className="p-2 pl-6 h-full w-full outline-none cursor-pointer sm:text-base text-sm rounded-lg bg-gray-200"
              type="text"
              // value={searchTerm}
              placeholder="Search a user"
              //onChange={searchProduct}
            />
          </div>
          <div className="overflow-y-auto  h-96 p-1">
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id.toString()}
              pageSize={10}
              disableSelectionOnClick
              className="bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700 "
              autoHeight
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;

export const getStaticProps = async () => {
  await db.connect();

  let users = await User.find().lean();
  users = JSON.parse(JSON.stringify(users));

  return {
    props: {
      users,
    },
    revalidate: 1,
  };
};

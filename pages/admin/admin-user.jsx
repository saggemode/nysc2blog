import AdminLayout from "@/components/Layout/AdminLayout";
import React, { Fragment, useState } from "react";
import db from "@/util/db";
import getUsers from "@/util/getUsers";
import Head from "next/head";
import { CircularProgress } from "@mui/material";
import User from "@/models/User";
import { DataGrid, DataGridTextColumn } from "@mui/x-data-grid";
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

export default function AdminUser(props) {
  const { users, error, isLoading } = getUsers(props?.users);
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
        NormalToast(err);
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
        <title>Akama | Admin Users</title>
      </Head>
    <AdminLayout>
      <div className="flex h-full flex-col justify-center items-center ">
        <span className="text-7xl mb-5 font-bold">Users </span>
        <div className="mb-4 text-blue">
          <Link href={`/admin/add-user`} legacyBehavior>
            add User
          </Link>
        </div>
        {/* <div className="py-2">
            <input
              className="p-2 pl-6 h-full w-full outline-none cursor-pointer sm:text-base text-sm rounded-lg bg-gray-200"
              type="text"
              // value={searchTerm}
              placeholder="Search a user"
              //onChange={searchProduct}
            />
          </div> */}
        <div className="overflow-y-auto  h-96 p-1 md:col-span-3">
          {isLoading ? (
            <div className="justify-center items-center ">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id.toString()}
              pageSize={10}
              disableSelectionOnClick
              className="bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700 "
              autoHeight
            />
          )}
        </div>
      </div>
    </AdminLayout>
    </>
  );
}

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

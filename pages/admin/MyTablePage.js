import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";
import { DataGrid } from "@mui/x-data-grid";
import db from "@/util/db";
import User from "@/models/User";
import getUsers from "@/util/getUsers";
import Link from "next/link";
import { EditNotifications } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function MyTablePage(props) {
  const { users, error } = getUsers(props?.users);
  const [disabled, setDisabled] = useState(false);

  const deleteProduct = async (userId) => {
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

            <Button onClick={() => deleteProduct(params.row._id)}>
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
    <Fragment>
      {/* <MetaData title={`ALL USERS - Admin`} /> */}

      <div className="heightFixAdmin bg-gray-100 py-10 md:px-6">
        <div className="max-w-screen-xl mx-auto bg-white  shadow rounded-md my-6">
          <div className="flex flex-col md:p-8  p-6  bg-white gap-6">
            <h1 className="sm:text-2xl text-xl  font-semibold border-b-2 border-gray-200 pb-4 text-gray-700">
              USERS
            </h1>
           
          
         
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="w-full overflow-x-auto">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id.toString()}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps() {
  await db.connect();

  let users = await User.find().lean();
  users = JSON.parse(JSON.stringify(users));

  // console.log(users);
  return {
    props: {
      users,
    },
    revalidate: 1,
  };
}

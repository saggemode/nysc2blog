import AdminLayout from "@/components/Layout/AdminLayout";
import React, { Fragment, useState } from "react";
import db from "@/util/db";
import getProducts from "@/util/getProducts";
import Head from "next/head";
import { CircularProgress } from "@mui/material";
import Product from "@/models/Product";
import { DataGrid, DataGridTextColumn } from "@mui/x-data-grid";
import { EditNotifications } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";
import Skeleton from "react-loading-skeleton";

export default function AdminProducts(props) {
  const { products, error,isLoading } = getProducts(props?.products);
  const [disabled, setDisabled] = useState(false);

  if (error) {
    console.error(error);
  }

  const deleteProuct = async (pId) => {
    setDisabled(true);
    await axios
      .delete(`/api/admin/products/${pId}`)
      .then(() => {
        NormalToast("Product deleted");
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
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
      flex: 0.3,
    },

    // {
    //   field: "isAdmin",
    //   headerName: "IsAdmin",
    //   // type: "number",
    //   minWidth: 150,
    //   flex: 0.3,

    //   cellClassName: (params) => {
    //     {
    //       params.isAdmin ? "YES" : "NO";
    //     }
    //   },
    // },

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
            <Link href={`/admin/product/${params.row._id}`}>
              <EditNotifications />
            </Link>

            <Button onClick={() => deleteProuct(params.row._id)}>
              {/* <DeleteIcon /> */}
              delete
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
      });
    });

  return (
    <>
     <Head>
        <title>Akama | Admin Products</title>
      </Head>
    <AdminLayout>
      <div className="flex h-full  flex-col justify-center items-center ">
        <span className="text-7xl mb-5 font-bold">Products </span>
        <div className="mb-4 text-blue">
          <Link href={`/admin/add-product`} legacyBehavior>
            add product
          </Link>
        </div>
        <div className="overflow-y-auto overflow-x-auto h-96 p-1 md:col-span-3">
        {isLoading ? (
           <div className="justify-center items-center ">
              <CircularProgress />
              {/* <Skeleton width={100} count={12} /> */}
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
            autoWith
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
  let products = await Product.find().lean();
  products = JSON.parse(JSON.stringify(products));
  return {
    props: {
      products,
    },
    revalidate: 1,
  };
};

import { useState } from "react";
import React, { Fragment } from "react";
import db from "@/util/db";
import getProducts from "@/util/getProducts";
import Head from "next/head";

import Product from "@/models/Product";
import {
  ArchiveBoxArrowDownIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { EditNotifications } from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";

export default function Products(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { products, error } = getProducts(props?.products);
  const [searchResult, setSearchResult] = useState(products);
  const options = {
    keys: ["name", "description", "category"],
  };

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
      minWidth: 200,
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "price",
      headerName: "Price",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
      flex: 0.5,
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

  const searchProduct = async (e) => {
    let term = e.target.value;
    setSearchTerm(term);
    term = term.toLowerCase();
    // Dynamically load fuse.js
    const Fuse = (await import("fuse.js")).default;
    const fuse = new Fuse(products ? products : [], options);
    const result = fuse
      .search(term)
      .map(
        ({
          item: { _id, slug, name, price, description, category, image },
        }) => ({
          _id,
          slug,
          name,
          price,
          description,
          category,
          image,
        })
      );
    setSearchResult(result);
  };

  const removeFromSearchResults = (_id) => {
    setSearchResult((products) =>
      products.filter((product) => product._id !== _id)
    );
  };

  return (
    <>
      <Head>
        <title>Radon | Products</title>
      </Head>

      <div className="heightFixAdmin px-6 lg:py-20 sm:py-16 py-12">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="lg:text-4xl sm:text-3xl text-2xl  font-bold mb-6 ">
            Products
          </h2>
          <div className="flex gap-4 sm:gap-6 lg:gap-8  text-blue-light font-medium flex-wrap sm:text-base text-sm">
            <Link href="/admin/products">
              <div className="dashboard-link bg-blue-light text-white flex items-center gap-1">
                <ArchiveBoxArrowDownIcon className="w-4" />
                <span>Products</span>
              </div>
            </Link>
            <Link href="/admin/users">
              <div className="dashboard-link flex items-center gap-1">
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
              value={searchTerm}
              placeholder="Search a product"
              onChange={searchProduct}
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
}

Products.auth = { adminOnly: true };

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

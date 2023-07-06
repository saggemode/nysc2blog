import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice";
import ProductSlice from "./ProductSlice";
import OrderSlice from "./OrderSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createWrapper } from "next-redux-wrapper";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

export const store = configureStore({
  reducer: {
    cart: CartSlice,
    product: ProductSlice,
    order: OrderSlice,
  },
});
export default store;

































// import { configureStore } from "@reduxjs/toolkit";
// import CartSlice from "./CartSlice";
// import ProductSlice from "./ProductSlice";
// import OrderSlice from "./OrderSlice";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { createWrapper } from "next-redux-wrapper";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// export const store = configureStore({
//   reducer: {
//     cart: CartSlice,
//     product: ProductSlice,
//     order: OrderSlice,
//   },
// });
// export default store;

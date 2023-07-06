import { createSlice } from "@reduxjs/toolkit";
import addedToCartToast from "../util/Toast/addedToCartToast";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  MY_ORDERS_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET,
} from "../constants/OrderConstant";

const initialState = {
  items: [],
  orderItems: [],
  shippingAddress: {},
  loading: false,
  error: null,
};

export const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    //Actions
    hydrate: (state, action) => {
      return action.payload;
    },

    loadOrderSuccess: (state, action) => {
      state.orderItems = action.payload;
      state.loading = false;
      state.error = null;
    },

    orderCreateReducer: (state = {}, action) => {
      switch (action.type) {
        case ORDER_CREATE_REQUEST:
          return {
            loading: true,
          };
        case ORDER_CREATE_SUCCESS:
          return {
            loading: false,
            success: true,
            orderItems: action.payload,
          };
        case ORDER_CREATE_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        default:
          return state;
      }
    },

    orderDetailsReducer: (
      state = { loading: true, orderItems: [], shippingAddress: {} },
      action
    ) => {
      switch (action.type) {
        case ORDER_DETAILS_REQUEST:
          return {
            ...state,
            loading: true,
          };
        case ORDER_DETAILS_SUCCESS:
          return {
            loading: false,
            order: action.payload,
          };
        case ORDER_DETAILS_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        default:
          return state;
      }
    },

    orderPayReducer: (state = {}, action) => {
      switch (action.type) {
        case ORDER_PAY_REQUEST:
          return {
            loading: true,
          };
        case ORDER_PAY_SUCCESS:
          return {
            loading: false,
            success: true,
          };
        case ORDER_PAY_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        case ORDER_PAY_RESET:
          return {};
        default:
          return state;
      }
    },

    orderDeliverReducer: (state = {}, action) => {
      switch (action.type) {
        case ORDER_DELIVER_REQUEST:
          return {
            loading: true,
          };
        case ORDER_DELIVER_SUCCESS:
          return {
            loading: false,
            success: true,
          };
        case ORDER_DELIVER_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        case ORDER_DELIVER_RESET:
          return {};
        default:
          return state;
      }
    },

    myOrdersReducer: (state = { orders: [] }, action) => {
      switch (action.type) {
        case MY_ORDERS_REQUEST:
          return {
            loading: true,
          };
        case MY_ORDERS_SUCCESS:
          return {
            loading: false,
            orders: action.payload,
          };
        case MY_ORDERS_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        case MY_ORDERS_RESET:
          return {
            orders: [],
          };
        default:
          return state;
      }
    },

    orderListReducer: (state = { orders: [] }, action) => {
      switch (action.type) {
        case ORDER_LIST_REQUEST:
          return {
            loading: true,
          };
        case ORDER_LIST_SUCCESS:
          return {
            loading: false,
            orders: action.payload,
          };
        case ORDER_LIST_FAIL:
          return {
            loading: false,
            error: action.payload,
          };
        default:
          return state;
      }
    },

    emptyOrder: (state, action) => {
      state.orderItems = [];
    },
  },
});

export const {
  loadOrderSuccess,
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  myOrdersReducer,
  orderListReducer,
  hydrate,
  emptyOrder,
} = OrderSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.cart.items;
export const selectTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.qty, 0);

export default OrderSlice.reducer;

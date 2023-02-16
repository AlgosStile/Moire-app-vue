/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
    deliveryData: '',
    paymentData: '',
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const productInfo = state.cartProductsData.find((p) => p.id === item.productCode).product;
        return {
          ...item,
          product: {
            ...productInfo,
            // image: productInfo.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartLength(state) {
      return state.cartProducts.length;
    },
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { basketItemId, amount }) {
      const item = state.cartProducts.find((i) => i.productCode === basketItemId);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productCode) {
      state.cartProducts = state.cartProducts.filter((item) => item.productCode !== productCode);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productCode: item.id,
          amount: item.quantity,
          colorId: item.color.color.id,
          colorCode: item.color.color.code,
          colorTitle: item.color.color.title,
          sizeId: item.size.id,
          sizeTitle: item.size.title,
        };
      });
    },
    updateDeliveryData(state, data) {
      state.deliveryData = data;
    },
    updatePaymentTypes(state, data) {
      state.paymentData = data;
    },
  },
  actions: {
    async loadOrderInfo(context, orderId) {
      try {
        const response = axios
          .get(`${API_BASE_URL}/api/orders/${orderId}`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          });
        const result = await response;
        context.commit('updateOrderInfo', result.data);
      } catch (error) {
        context.commit('updateOrderInfo');
      }
    },
    async loadCart(context) {
      const response = axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        });
      const result = await response;
      if (!context.state.userAccessKey) {
        localStorage.setItem('userAccessKey', result.data.user.accessKey);
        context.commit('updateUserAccessKey', result.data.user.accessKey);
      }
      context.commit('updateCartProductsData', result.data.items);
      context.commit('syncCartProducts');
    },
    async addProductToCart(context, {
      productId, colorId, sizeId, amount,
    }) {
      const response = axios.post(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        colorId,
        sizeId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      });
      const result = await response;
      context.commit('updateCartProductsData', result.data.items);
      context.commit('syncCartProducts');
    },
    async updateCartProductAmount(context, { basketItemId, amount }) {
      context.commit('updateCartProductAmount', { basketItemId, amount });
      if (amount < 1) {
        return;
      }
      try {
        const response = axios.put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        });
        const result = await response;
        context.commit('updateCartProductsData', result.data.items);
      } catch (error) {
        context.commit('syncCartProducts');
      }
    },
    async deleteCartProduct(context, { basketItemId }) {
      await axios.delete(`${API_BASE_URL}/api/baskets/products`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
        data: {
          basketItemId,
        },
      });
      context.commit('deleteCartProduct', basketItemId);
    },
    async loadDeliveryTypes(context) {
      const response = axios
        .get(`${API_BASE_URL}/api/deliveries`, {
        });
      const result = await response;
      context.commit('updateDeliveryData', result.data);
    },
    async loadPaymentTypes(context) {
      const response = axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: 1,
          },
        });
      const result = await response;
      context.commit('updatePaymentTypes', result.data);
    },
  },
  modules: {
  },
});

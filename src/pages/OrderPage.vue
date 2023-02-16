<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}"> Корзина </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя"/>
            <BaseFormText v-model="formData.address" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес"/>
            <BaseFormText v-model="formData.phone" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон"/>
            <BaseFormText v-model="formData.email" :error="formError.email" title="Email" placeholder="Введи ваш Email"/>
            <BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" v-model="formData.comment" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
              <DeliveryType :deliveryData="deliveryData" @updateDeliveryType="deliveryType = $event"/>
            <h3 class="cart__title">Оплата</h3>
              <PaymentType :paymentData="paymentData" @updatePaymentType="paymentType = $event"/>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderProduct v-for="item in products" :key="item.product.productCode" :item="item"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>0 ₽</b></p>
            <p>Итого: <b>{{ cartLength }}</b> товара на сумму <b>{{ totalPrice }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit" :disabled="orderSending">
            Оформить заказ
          </button>
        </div>
        <div v-if="orderSending">
          Подождите, идёт оформление заказа...
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
        <div class="cart__error form__error-block" v-if="formError.paymentTypeId">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formError.paymentTypeId }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { mapGetters, mapActions } from 'vuex';
import OrderProduct from '@/components/OrderProduct.vue';
import DeliveryType from '@/components/DeliveryType.vue';
import PaymentType from '@/components/PaymentType.vue';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderSending: false,
      deliveryType: 1,
      // deliveryPrice: '',
      paymentType: 1,
    };
  },
  methods: {
    ...mapActions(['loadDeliveryTypes', 'loadPaymentTypes']),
    async order() {
      try {
        this.formError = {};
        this.formErrorMessage = '';
        this.orderSending = true;
        const response = axios
          .post(`${API_BASE_URL}/api/orders`, {
            ...this.formData,
            deliveryTypeId: this.deliveryType,
            paymentTypeId: this.paymentType,
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          });
        const result = await response;
        this.$store.commit('resetCart');
        this.$store.commit('updateOrderInfo', result.data);
        this.$router.push({ name: 'orderInfo', params: { id: result.data.id } });
        this.orderSending = false;
      } catch (error) {
        this.formError = error.response.data.error.request || {};
        this.formErrorMessage = error.response.data.error.message;
        this.orderSending = false;
      }
    },
  },
  components: {
    BaseFormText, BaseFormTextarea, OrderProduct, DeliveryType, PaymentType,
  },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', cartLength: 'cartLength' }),
    deliveryData() {
      return this.$store.state.deliveryData;
    },
    paymentData() {
      return this.$store.state.paymentData;
    },
  },
  created() {
    this.loadDeliveryTypes();
    this.loadPaymentTypes();
  },
};
</script>

<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <li class="cart__item product">
    <div class="product__pic">
      <ProductImage class="cart-item__image" :product="this.product" :selectedColor="item.colorId"/>
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info product__info--size">Размер: {{ item.sizeTitle }}</p>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{ 'background-color': item.colorCode }"></i>
        {{ item.colorTitle }}
      </span>
    </p>
    <span class="product__code"> Артикул: {{ item.productCode }} </span>

    <ProductCounter class="cart-item__counter" :amount.sync="amount"/>

    <b class="product__price">{{ item.amount * item.product.price | numberFormat }}</b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productCode)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import ProductCounter from '@/components/ProductCounter.vue';
import { mapActions } from 'vuex';
import ProductImage from '@/components/ProductImage.vue';

export default {
  filters: { numberFormat },
  components: { ProductCounter, ProductImage },
  props: ['item'],
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { basketItemId: this.item.productCode, amount: value });
      },
    },
    product() {
      return this.item.product;
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    deleteProduct(value) {
      this.deleteCartProduct({ basketItemId: value });
    },
  },
};

</script>

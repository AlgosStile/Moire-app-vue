<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params:{id: product.id} }">
      <ProductImage :product="product" :selectedColor="selectedColor"/>
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{name: 'product', params:{id: product.id} }"> {{ product.title }} </router-link>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }} ₽ </span>

    <ProductColors :colors="colors" @updateColor="selectedColor = $event"/>

  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import ProductColors from '@/components/ProductColors.vue';
import ProductImage from '@/components/ProductImage.vue';

export default {
  data() {
    return {
      selectedColor: this.product.colors[0].color.id,
    };
  },
  components: { ProductColors, ProductImage },
  props: ['product'],
  filters: {
    numberFormat,
  },
  computed: {
    colors() {
      return this.product.colors;
    },
  },
};
</script>

<template>
  <li class="cart__order">
    <h3>{{ item.product.title }}</h3>
    <b>{{ item.product.price }} ₽</b>
    <span v-if="item.id">Артикул: {{ item.id }}</span>
    <span v-else>Артикул: {{ item.productCode }}</span>
  </li>
</template>

<script>

export default {
  props: ['item'],
};
</script>

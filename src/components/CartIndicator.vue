<!-- eslint-disable max-len -->
<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{ $store.state.cartProducts.length }}</span>
  </router-link>
</template>

<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable max-len -->
<template>

  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ cartLength }} товара(ов)
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <PagePreloader v-if="cartloading"/>
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.product.productCode" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }}</span>
          </p>

          <router-link class="cart__button button button--primery" type="submit" :to="{name: 'order'}" v-show="!cartLength == 0">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>

</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import CartItem from '@/components/CartItem.vue';
import PagePreloader from '@/components/PagePreloader.vue';
import { mapGetters } from 'vuex';

export default ({
  props: ['cartloading'],
  filters: { numberFormat },
  components: { CartItem, PagePreloader },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', cartLength: 'cartLength' }),
  },
});

</script>

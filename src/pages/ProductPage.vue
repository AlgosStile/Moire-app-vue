<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable max-len -->
<template>
  <div>
    <PagePreloader v-if="productLoading" />
    <main v-else-if="productLoadingFailed" class="content container">
      Не удалось загрузить товар
    </main>
    <main v-else class="content container">
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
              Каталог
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
              {{ category.title }}
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link"> {{ product.title }} </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <ProductImage class="product-page__image" :product="product" :selectedColor="selectedColor"/>
          </div>
          <ul v-if="gallery" class="pics__list">
            <li
              class="pics__item"
              v-for="option in productOptions"
              :key="option.id"
            >
            <label class="product-page__image-label">
              <div class="pics__link" :class="{ 'pics__link--current': isActiveImage(option.color.id) }">
                <input class="product-page__image-input"
                type="radio"
                :value="option.color.id"
                v-model="selectedColor"/>
                <img
                    width="98"
                    height="98"
                    :src="option.gallery[0].file.url"
                    :alt="product.title"
                  />
              </div>
            </label>
            </li>
          </ul>
        </div>

        <div class="item__info">
          <span class="item__code">Артикул: {{ product.id }}</span>
          <h2 class="item__title">{{ product.title }}</h2>
          <div class="item__form">
            <form
              class="form"
              action="#"
              method="POST"
              @submit.prevent="addToCart"
            >
              <div class="item__row item__row--center">
                <ProductCounter
                  class="product-page__counter"
                  :amount.sync="productAmount"
                />

                <b class="item__price"> {{ product.price | numberFormat }} ₽</b>
              </div>

              <div class="item__row">
                <fieldset class="form__block">
                  <legend class="form__legend">Цвет</legend>

                  <ProductColors :colors="colors" @updateColor="selectedColor = $event"/>

                </fieldset>

                <fieldset class="form__block">
                  <legend class="form__legend">Размер</legend>
                  <label
                    class="form__label form__label--small form__label--select"
                  >
                    <select class="form__select" type="text" name="category" v-model="selectedSize">
                      <option
                        :value="size.id"
                        v-for="size in sizes"
                        :key="size.id"
                      >
                        {{ size.title }}
                      </option>
                    </select>
                  </label>
                </fieldset>
              </div>

              <button
                class="item__button button button--primery"
                type="submit"
                :disabled="productAddSending"
              >
                В корзину
              </button>
              <div class="success-message" v-show="productAdded">Товар добавлен в корзину</div>
              <div class="sending-message"  v-show="productAddSending">Добавляем товар в корзину...</div>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <li class="tabs__item">
              <a
                class="tabs__link"
                @click.prevent="setActiveTab('productInfo')"
                :class="{ 'tabs__link--current': isActive('productInfo') }"
                @keypress.prevent="setActiveTab('productInfo')"
              >
                Информация о товаре
              </a>
            </li>
            <li class="tabs__item">
              <a
                class="tabs__link"
                @click.prevent="setActiveTab('productProperty')"
                :class="{ 'tabs__link--current': isActive('productProperty') }"
                @keypress.prevent="setActiveTab('productProperty')"
              >
                Доставка и возврат
              </a>
            </li>
          </ul>

          <div
            class="item__content fade"
            :class="{ 'show-active-tab': isActive('productInfo') }"
          >
            <h3>Состав:</h3>
            <p>
              60% хлопок<br />
              30% полиэстер<br />
            </p>
            <h3>Уход:</h3>
            <p>
              Машинная стирка при макс. 30ºC короткий отжим<br />
              Гладить при макс. 110ºC<br />
              Не использовать машинную сушку<br />
              Отбеливать запрещено<br />
              Не подвергать химчистке<br />
            </p>
          </div>

          <div
            class="item__content fade"
            :class="{ 'show-active-tab': isActive('productProperty') }"
          >
            <h3>Доставка:</h3>
            <p>
              1. Курьерская доставка по Москве и Московской области – 290 ₽<br />
              2.Самовывоз из магазина. Список и адреса магазинов Вы можете
              посмотреть здесь<br />
            </p>
            <h3>Возврат:</h3>
            <p>
              Любой возврат должен быть осуществлен в течение Возвраты в
              магазине БЕСПЛАТНО.<br />
              Вы можете вернуть товары в любой магазин. Магазин должен быть
              расположен в стране, в которой Вы осуществили покупку. БЕСПЛАТНЫЙ
              возврат в Пункт выдачи заказов.<br />
              Для того чтобы вернуть товар в одном из наших Пунктов выдачи
              заказов, позвоните по телефону 8 800 600 90 09<br />
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import ProductCounter from '@/components/ProductCounter.vue';
import ProductColors from '@/components/ProductColors.vue';
import PagePreloader from '@/components/PagePreloader.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { mapActions } from 'vuex';
import ProductImage from '@/components/ProductImage.vue';

export default {
  data() {
    return {
      productAmount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      selectedColor: '',
      selectedSize: '',
      gallery: '',
      productOptions: '',
      activeItem: 'productInfo',
    };
  },
  components: {
    ProductCounter, ProductColors, PagePreloader, ProductImage,
  },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    colors() {
      return this.productData.colors;
    },
    sizes() {
      return this.productData.sizes;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActiveTab(menuItem) {
      this.activeItem = menuItem;
    },
    isActiveImage(colorId) {
      return this.selectedColor === colorId;
    },
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({
        productId: this.product.id,
        amount: this.productAmount,
        sizeId: this.selectedSize,
        colorId: this.selectedColor,
      }).then(() => {
        this.productAdded = true;
        this.productAddSending = false;
      });
    },
    async loadProduct() {
      try {
        this.productLoading = true;
        this.productLoadingFailed = false;
        const response = axios
          .get(`${API_BASE_URL}/api/products/${this.$route.params.id}`);
        const result = await response;
        this.productData = result.data;
        this.gallery = result.data.colors[0].gallery;
        this.productOptions = result.data.colors;
        this.selectedColor = result.data.colors[0].color.id;
        this.selectedSize = result.data.sizes[0].id;
      } catch (error) {
        this.productLoadingFailed = true;
      }
      this.productLoading = false;
    },
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>

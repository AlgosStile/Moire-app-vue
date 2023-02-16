<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable linebreak-style -->
<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info"> {{ productsCount }} товаров </span>
      </div>
    </div>
    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :product-color.sync="filterColor"
        :material-ids.sync="filterMaterial"
        :season-ids.sync="filterSeason"
        :productsAmountOptions="productsAmountOptions"
        @updateProductPerPage="productsPerPage = $event"
      />
      <section class="catalog">
        <div v-if="productsLoadingFailed">Не удалось загрузить товары...</div>
        <PagePreloader v-else-if="productsLoading"/>
        <ProductList v-else :products="products"/>

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import PagePreloader from '@/components/PagePreloader.vue';
import BasePagination from '@/components/BasePagination.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      page: 1,
      productsPerPage: 12,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterMaterial: null,
      filterSeason: null,
      filterColor: null,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
      productsArray: '',
      productsCount: '',
      productsAmountOptions: [
        3, 6, 12,
      ],
    };
  },
  components: {
    BasePagination, ProductList, ProductFilter, PagePreloader,
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    async loadProductsCount() {
      const response = axios
        .get(`${API_BASE_URL}/api/products`);
      const result = await response;
      this.productsCount = result.data.items.length;
    },
    async loadProducts() {
      try {
        this.productsLoading = true;
        this.productsLoadingFailed = false;
        const response = axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              categoryId: this.filterCategoryId,
              materialIds: this.filterMaterial,
              seasonIds: this.filterSeason,
              colorIds: this.filterColor,
            },
          });
        const result = await response;
        this.productsData = result.data;
      } catch (error) {
        this.productsLoadingFailed = true;
      }
      this.productsLoading = false;
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterMaterial() {
      this.loadProducts();
    },
    filterSeason() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
    this.loadProductsCount();
  },
};
</script>

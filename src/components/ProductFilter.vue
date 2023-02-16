<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <aside class="filter">
    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <legend class="form__legend">Товаров на странице</legend>
      <label class="form__label form__label--select">
      <select
        class="form__select"
        name="productPerPage"
        v-model.number="productsPerPage"
        @click="changeProductPerPage"
      >
        <option
          :value="option"
          v-for="option in productsAmountOptions"
          :key="option"
        >
          {{ option }}
        </option>
      </select>
      </label>
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                :value="color.id"
                v-model.number="selectedColor"
              />
              <span
                class="colors__value"
                :style="{ 'background-color': color.code }"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materials"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model.number="currentMaterialId"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model.number="currentSeasonsId"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button
        v-show="resetButton"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentMaterialId: [],
      currentSeasonsId: [],
      selectedColor: [],
      categoriesData: null,
      filterColorsData: null,
      filterMaterialsData: null,
      filterSeasonsData: null,
      resetButton: false,
      productsPerPage: 12,
    };
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'productColor',
    'materialIds',
    'seasonIds',
    'productsAmountOptions',
  ],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.filterColorsData ? this.filterColorsData.items : [];
    },
    materials() {
      return this.filterMaterialsData ? this.filterMaterialsData.items : [];
    },
    seasons() {
      return this.filterSeasonsData ? this.filterSeasonsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    productColor(value) {
      this.selectedColor = value;
    },
    materialIds(value) {
      this.currentMaterialId = value;
    },
    seasonIds(value) {
      this.currentSeasonsId = value;
    },
  },
  methods: {
    submit() {
      if (
        this.currentPriceFrom
        || this.currentPriceTo
        || this.currentCategoryId
        || this.currentMaterialId.length
        || this.currentSeasonsId.length
        || this.selectedColor.length
      ) {
        this.$emit('update:priceFrom', this.currentPriceFrom);
        this.$emit('update:priceTo', this.currentPriceTo);
        this.$emit('update:categoryId', this.currentCategoryId);
        this.$emit('update:productColor', this.selectedColor);
        this.$emit('update:materialIds', this.currentMaterialId);
        this.$emit('update:seasonIds', this.currentSeasonsId);
        this.resetButton = true;
      }
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:productColor', []);
      this.$emit('update:materialIds', []);
      this.$emit('update:seasonIds', []);
      this.resetButton = false;
    },
    async loadCategories() {
      const response = axios
        .get(`${API_BASE_URL}/api/productCategories`);
      const result = await response;
      this.categoriesData = result.data;
    },
    async loadColors() {
      const response = axios
        .get(`${API_BASE_URL}/api/colors`);
      const result = await response;
      this.filterColorsData = result.data;
    },
    async loadMaterials() {
      const response = axios
        .get(`${API_BASE_URL}/api/materials`);
      const result = await response;
      this.filterMaterialsData = result.data;
    },
    async loadSeasons() {
      const response = axios
        .get(`${API_BASE_URL}/api/seasons`);
      const result = await response;
      this.filterSeasonsData = result.data;
    },
    changeProductPerPage(event) {
      this.productPerPage = Number(event.target.value);
      this.$emit('updateProductPerPage', this.productPerPage);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
};
</script>

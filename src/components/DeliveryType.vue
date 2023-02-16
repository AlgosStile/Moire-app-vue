<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul class="cart__options options">
    <li class="options__item"  v-for="delivery in deliveryData" :key="delivery.id">
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          name="delivery"
          :value="delivery.id"
          v-model="deliveryType"
          @click="changeDeliveryType"
        />
        <span class="options__value">
          {{ delivery.title }} <b>{{ delivery.price }} ₽</b>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      deliveryType: 1,
    };
  },
  props: ['deliveryData'],
  methods: {
    changeDeliveryType(event) {
      this.deliveryType = Number(event.target.value);
      this.$emit('updateDeliveryType', this.deliveryType);
    },
  },
};
</script>

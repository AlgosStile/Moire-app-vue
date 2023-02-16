<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="payment in paymentData" :key="payment.id">
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          name="pay"
          :value="payment.id"
          v-model="paymentType"
          @click="changePaymentType"
        />
        <span class="options__value"> {{ payment.title }} </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      paymentType: 1,
    };
  },
  props: ['paymentData'],
  methods: {
    changePaymentType(event) {
      this.paymentType = Number(event.target.value);
      this.$emit('updatePaymentType', this.paymentType);
    },
  },
};
</script>

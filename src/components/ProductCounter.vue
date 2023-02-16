<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар"  @click="computedAmount--">
      <svg fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" name="count" v-model.number="computedAmount"/>

    <button type="button" aria-label="Добавить один товар" @click="computedAmount++">
      <svg fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['amount'],
  computed: {
    computedAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        if (value >= 0) {
          this.$emit('update:amount', value);
        }
      },
    },
  },
};
</script>

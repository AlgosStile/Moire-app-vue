<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul v-if="colors" class="colors colors--black">
    <li
      class="colors__item"
      v-for="option in colors"
      :key="option.color.id"
    >
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          :value="option.color.id"
          v-model="selectedColor"
          @click="changeColor"
        />
        <span
          class="colors__value"
          :style="{ 'background-color': option.color.code }"
        ></span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      selectedColor: this.colors[0].color.id,
    };
  },
  props: ['colors'],
  methods: {
    changeColor(event) {
      this.selectedColor = Number(event.target.value);
      this.$emit('updateColor', this.selectedColor);
    },
  },
};
</script>

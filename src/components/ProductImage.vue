<template>
  <div>
    <img v-if="gallery"
      :src="selectedImage"
      :alt="product.title"
    />
    <div v-else>Фото отсутствует</div>
  </div>
</template>

<script>

export default {
  props: ['product', 'selectedColor'],
  computed: {
    mainColor() {
      return this.product.colors.find((i) => i.color.id === this.selectedColor);
    },
    selectedImage() {
      return this.mainColor.gallery[0].file.url;
    },
    gallery() {
      return this.mainColor.gallery;
    },
  },
};
</script>

<template>
  <q-page class="column q-pa-lg">
    <GalleryImg :image-data="imageData" />
  </q-page>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import type { IImageData } from 'src/models/Gallery';

export default defineComponent({
  name: 'CreateMenuPage',
  components: { GalleryImg },
  setup() {
    const imageData = ref<IImageData>({
      homeImgUrl: undefined,
      images: [],
    });

    return {
      imageData,
    };
  },
});
</script>

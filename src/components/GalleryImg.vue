<template>
  <q-img
    class="q-mb-sm img-gallery"
    :src="imageData.homeImgUrl || image_placeholder"
    alt="Фото блюда"
    :ratio="16 / 9"
    @click="onImageClick"
    placeholder-src="~assets/image_placeholder.svg"
  >
    <template v-slot:error>
      <div class="absolute-full column flex-center bg-negative text-white">
        <span>Не удалось загрузить изображение</span><br />
        <q-icon name="sym_o_mood_bad" size="48px"></q-icon>
      </div>
    </template>

    <div class="absolute-bottom text-center">Нажми для добавления фото</div>
  </q-img>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MenuImgUploader from 'components/ImgUploader.vue';
import { useModals } from 'src/composables/useModals';
import type { IImageData } from 'src/models/Gallery';

import image_placeholder from 'src/assets/image_placeholder.svg';

export default defineComponent({
  name: 'GalleryImg',
  props: {
    imageData: {
      type: Object as PropType<IImageData>,
      required: true,
    },
  },
  emits: {
    'update:imageData': (_data: IImageData) => true,
  },
  setup(props, { emit }) {
    const modal = useModals();

    function onImageClick() {
      modal.show(MenuImgUploader, {
        compAttrs: {
          fullWidth: true,
          imageData: props.imageData,
        },
        compListeners: {
          'update:imageData': (data: IImageData) =>
            emit('update:imageData', data),
        },
      });
    }

    return {
      onImageClick,
      image_placeholder,
    };
  },
});
</script>

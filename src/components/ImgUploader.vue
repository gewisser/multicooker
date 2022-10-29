<template>
  <q-dialog full-width>
    <q-card>
      <q-card-section>
        <div class="text-h6 text-center">Галлерея</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 60vh" class="scroll">
        <div class="column full-width">
          <template v-if="!imageDataRef.images.length">
            <q-img
              class="q-mb-sm img-gallery"
              src="~assets/image_placeholder.svg"
              :ratio="16 / 9"
              placeholder-src="~assets/image_placeholder.svg"
              @click="onClickBtn"
            />
          </template>
          <template v-else>
            <q-img
              v-for="image in imageDataRef.images"
              :key="image.url"
              class="q-mb-sm img-gallery"
              :src="image.url"
              :ratio="16 / 9"
              placeholder-src="~assets/image_placeholder.svg"
            >
              <template v-slot:error>
                <div
                  class="absolute-full column flex-center bg-negative text-white"
                >
                  <span>Не удалось загрузить изображение</span><br />
                  <q-icon name="mood_bad" size="48px"></q-icon>
                </div>
              </template>

              <div class="absolute-bottom q-pa-none-important">
                <q-radio
                  dark
                  size="lg"
                  v-model="defaultImg"
                  :val="image.url"
                  label="На главной"
                />
              </div>
            </q-img>
          </template>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md" align="right">
        <div class="col">
          <q-btn
            padding="6px 16px"
            class="img-gallery full-width"
            label="Загрузить фото"
            :disable="isUploading"
            :loading="isUploading"
            dark-percentage
            color="secondary"
            text-color="white"
            icon="add_a_photo"
            @click="onClickBtn"
          />
        </div>
        <q-btn flat label="Закрыть" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>

    <input
      class="hidden"
      ref="fileInput"
      type="file"
      name="image"
      accept="image/*"
      capture="environment"
      @change="onFileChange"
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRef } from 'vue';
import { getFileData } from 'src/utils/files';
import useS3 from 'src/composables/useS3';
import { readImage } from 'src/utils/images';
import type { IImageData } from 'src/models/Gallery';

export default defineComponent({
  name: 'ImgUploader',
  props: {
    fullWidth: {
      type: Boolean,
      default: false,
    },
    imageData: {
      type: Object as PropType<IImageData>,
      required: true,
    },
  },
  emits: {
    'update:imageData': (_data: IImageData) => true,
  },
  setup(props, { emit }) {
    const imageDataRef = toRef(props, 'imageData');
    const defaultImg = toRef(props.imageData, 'homeImgUrl');

    const fileInput = ref<HTMLInputElement>();
    const S3 = useS3();
    const isUploading = ref(false);

    function onClickBtn() {
      fileInput.value?.click();
    }

    async function onFileChange(event: Event) {
      isUploading.value = true;

      const fileData = await getFileData(event, readImage(800, 600));

      if (fileInput.value) {
        fileInput.value.value = '';
      }

      const fileLink = await S3.Upload(
        fileData,
        import.meta.env.VITE_S3_IMG_DIR
      );

      imageDataRef.value.images.push({
        url: fileLink,
        fileName: fileData.fileName,
      });

      defaultImg.value = fileLink;

      emit('update:imageData', imageDataRef.value);

      isUploading.value = false;
    }

    return {
      onClickBtn,
      defaultImg,
      fileInput,
      onFileChange,
      isUploading,
      imageDataRef,
    };
  },
});
</script>

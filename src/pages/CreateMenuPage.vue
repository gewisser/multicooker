<template>
  <q-page class="column q-pa-lg form-page">
    <GalleryImg :image-data="newData.imageData" />

    <q-input
      rounded
      outlined
      v-model="newData.description"
      label="Опишите как готовить блюдо"
      type="textarea"
      autogrow
    >
    </q-input>

    <q-separator inset />

    <div class="column items-center group-set">
      <div class="text-subtitle1 text-grey-6">
        Установите температуру приготовления
      </div>
      <q-knob
        :step="1"
        v-model="newData.cooking_temperature"
        show-value
        size="120px"
        :max="300"
        :thickness="0.22"
        color="deep-orange"
        track-color="deep-orange-3"
        class="text-orange"
      />
    </div>

    <q-separator inset />

    <div class="column group-set">
      <q-toggle
        size="48px"
        v-model="newData.auto_heating"
        label="Установить температуру подогрева?"
      />

      <div v-if="newData.auto_heating" class="column items-center">
        <q-knob
          :step="1"
          v-model="newData.auto_heating_temp"
          show-value
          size="120px"
          :max="70"
          :thickness="0.22"
          color="orange"
          track-color="orange-3"
          class="text-orange"
        />
      </div>
    </div>

    <q-separator inset />

    <div class="column items-center group-set">
      <div class="column items-center">
        <div class="text-grey-6">Общее время приготовления</div>
        <AppTimer style="font-size: 16px" />
      </div>
      <div class="column items-center">
        <div class="text-grey-6">Общее время приготовления</div>
        <AppTimer style="font-size: 16px" />
      </div>
    </div>

    <q-separator inset />

    <q-card-actions class="q-px-none" align="center" vertical>
      <q-btn
        padding="10px 16px"
        icon="play_arrow"
        class="glossy"
        rounded
        color="deep-orange"
        label="Начать приготовление"
      />
      <q-btn
        icon="delete_forever"
        flat
        label="Удалить"
        color="primary"
        @click="onDeleteClick"
      />
      <!--      <q-btn label="Сохранить" color="primary" text-color="white" icon="save" />-->
    </q-card-actions>
  </q-page>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import { defineComponent } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import { useLocalStorage } from '@vueuse/core';
import type { IDish } from 'src/models/Dish';
import { nanoid } from 'nanoid';
import { useQuasar } from 'quasar';
import useS3 from 'src/composables/useS3';
import AppTimer from 'components/AppTimer.vue';

const NEW_DISH_KEY = 'new-menu';

export default defineComponent({
  name: 'CreateMenuPage',
  components: { AppTimer, GalleryImg },
  setup() {
    const $q = useQuasar();
    const S3 = useS3();

    function getDish() {
      return {
        id: nanoid(),
        imageData: {
          homeImgUrl: undefined,
          images: [],
        },
        description: '',
        cooking_temperature: 100,
        cooking_time: 0,
        auto_heating: true,
        auto_heating_temp: 40,
      };
    }

    const newData = useLocalStorage<IDish>(NEW_DISH_KEY, getDish());

    function onDeleteClick() {
      $q.dialog({
        title: 'Подтвердите',
        message: 'Вы действительно хотите удалить новое блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        newData.value.imageData.images.forEach((image) => {
          S3.Delete(image.fileName, import.meta.env.VITE_S3_IMG_DIR);
        });

        newData.value = getDish();
      });
    }

    return {
      onDeleteClick,
      newData,
    };
  },
});
</script>

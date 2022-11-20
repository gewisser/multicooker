<template>
  <q-page class="column q-pa-lg form-page">
    <GalleryImg :image-data="dish.imageData" />

    <q-input
      rounded
      outlined
      v-model="dish.title"
      label="Название блюда"
      input-class="text-h6"
      placeholder="Рагу овощное"
    />

    <q-input
      rounded
      outlined
      v-model="dish.ingredients"
      label="Перечислите через запятую ингридиенты"
      placeholder="Картофель, лук, морковь, кабачки..."
    />

    <q-input
      rounded
      outlined
      v-model="dish.description"
      label="Опишите как готовить блюдо"
      placeholder="Берём, кладём, готовим..."
      type="textarea"
      autogrow
    />

    <TempSettingControls
      :cooking-data="{
        cooking_temperature: toRef(dish, 'cooking_temperature'),
        auto_heating: toRef(dish, 'auto_heating'),
        auto_heating_temp: toRef(dish, 'auto_heating_temp'),
      }"
    />

    <q-separator inset />

    <TimersBlock
      :start-cooking-time="cooking.start_cooking_time"
      :start-total-time="cooking.start_total_time"
    />

    <q-card-actions
      class="q-px-none"
      align="center"
      vertical
      style="row-gap: 20px"
    >
      <q-btn
        v-if="cooking.start_total_time === 0"
        padding="10px 16px"
        icon="app:play_arrow"
        class="glossy"
        rounded
        color="deep-orange"
        label="Начать приготовление"
        @click="startCooking"
      />
      <q-btn
        v-if="cooking.start_cooking_time > 0"
        padding="10px 16px"
        icon="app:stop_circle"
        class="glossy"
        rounded
        color="green"
        label="Нажми, если блюдо готово"
        @click="stopCooking"
      />
      <q-btn
        v-if="cooking.start_total_time === 0"
        icon="app:delete_forever_fill"
        flat
        label="Удалить"
        color="deep-orange"
        @click="onDeleteClick"
      />
    </q-card-actions>
  </q-page>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import { useQuasar } from 'quasar';
import useS3 from 'src/composables/useS3';
import { useDish } from 'stores/dish';
import { storeToRefs } from 'pinia';
import TempSettingControls from 'components/TSetCtrls.vue';
import TimersBlock from 'components/TimersBlock.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CreateDishPage',
  components: { TimersBlock, TempSettingControls, GalleryImg },
  setup() {
    const $q = useQuasar();
    const S3 = useS3();
    const dishStore = useDish();
    const router = useRouter();

    const { dish, cooking } = storeToRefs(dishStore);

    function onDeleteClick() {
      $q.dialog({
        title: 'Подтвердите',
        message: 'Вы действительно хотите удалить новое блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        dish.value.imageData.images.forEach((image) => {
          S3.Delete(image.fileName, import.meta.env.VITE_S3_IMG_DIR);
        });
        dishStore.newDish();
      });
    }

    function startCooking() {
      dishStore.applyDishSettings(dish.value);
      dishStore.startCooking();
    }

    function stopCooking() {
      $q.dialog({
        title: 'Подтвердите сохранение',
        message:
          'Вы действительно хотите завершить приготовление и сохранить блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await dishStore.saveNewDishToList();
        dishStore.newDish();
        $q.notify({
          type: 'success',
          message: 'Блюдо успешно создано!',
        });
        router.push('/').then();
      });
    }

    return {
      onDeleteClick,
      dish,
      startCooking,
      cooking,
      stopCooking,
      toRef,
    };
  },
});
</script>

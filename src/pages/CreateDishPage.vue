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

    <div class="column items-center group-set">
      <div class="column items-center">
        <div class="text-grey-6">Общее время приготовления</div>
        <AppTimer v-model="cooking.start_total_time" style="font-size: 16px" />
      </div>
      <div class="column items-center">
        <div class="text-grey-6 text-center">
          Время приготовления<br />от достижения заданной температуры
        </div>
        <AppTimer
          v-model="cooking.start_cooking_time"
          style="font-size: 16px"
        />
      </div>
    </div>

    <q-card-actions
      class="q-px-none"
      align="center"
      vertical
      style="row-gap: 20px"
    >
      <q-btn
        v-if="cooking.start_total_time === 0"
        padding="10px 16px"
        icon="sym_o_play_arrow"
        class="glossy"
        rounded
        color="deep-orange"
        label="Начать приготовление"
        @click="startCooking"
      />
      <q-btn
        v-if="cooking.start_cooking_time > 0"
        padding="10px 16px"
        icon="sym_o_stop_circle"
        class="glossy"
        rounded
        color="green"
        label="Нажми, если блюдо готово"
        @click="stopCooking"
      />
      <q-btn
        icon="sym_o_delete_forever"
        flat
        label="Удалить"
        color="deep-orange"
        @click="onDeleteClick"
      />
      <!--      <q-btn label="Сохранить" color="primary" text-color="white" icon="save" />-->
    </q-card-actions>
  </q-page>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import { useQuasar } from 'quasar';
import useS3 from 'src/composables/useS3';
import AppTimer from 'components/AppTimer.vue';
import { useDish } from 'stores/appStore';
import { storeToRefs } from 'pinia';
import TempSettingControls from 'components/TSetCtrls.vue';

export default defineComponent({
  name: 'CreateDishPage',
  components: { TempSettingControls, AppTimer, GalleryImg },
  setup() {
    const $q = useQuasar();
    const S3 = useS3();
    const dishStore = useDish();

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
      dishStore.startCooking(dish.value);
    }

    function stopCooking() {
      $q.dialog({
        title: 'Подтвердите сохранение',
        message: 'Вы действительно завершить приготовление и сохранить блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await dishStore.saveNewDishToList();
        dishStore.newDish();
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

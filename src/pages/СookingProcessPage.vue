<template>
  <q-page class="column q-pa-lg" style="gap: 0.8rem">
    <div class="text-h5 text-center">{{ currentDishProcess.title }}</div>
    <GalleryImg :image-data="currentDishProcess.imageData" />
    <div class="text-subtitle2 row items-center justify-center ingredient-list">
      <q-icon name="sym_o_production_quantity_limits" size="18px" />
      <div
        class="ingredient-list-item"
        v-for="ingredient in splitIngredients(currentDishProcess.ingredients)"
        :key="ingredient"
      >
        {{ ingredient }}
      </div>
    </div>
    <div
      class="text-body2 text-grey-7"
      style="white-space: pre-line; text-align: justify"
    >
      {{ currentDishProcess.description }}
    </div>

    <q-separator inset />

    <div class="row items-center" style="margin-top: -1rem">
      <div class="col-6 flex justify-center">
        <div class="text-subtitle1 text-grey-6">T° приготовления</div>
      </div>
      <div class="col-6 flex justify-center">
        <q-toggle
          keep-color
          dense
          size="38px"
          v-model="currentDishProcess.auto_heating"
        >
          <span class="text-subtitle1 text-grey-6">T° подогрева</span>
        </q-toggle>
      </div>
    </div>

    <div class="row items-center" style="margin-top: -1rem">
      <div class="col-6 flex justify-center">
        <q-knob
          :step="1"
          v-model="currentDishProcess.cooking_temperature"
          show-value
          size="120px"
          :max="300"
          :thickness="0.22"
          color="deep-orange"
          track-color="deep-orange-3"
          class="text-orange"
        />
      </div>
      <div class="col-6 flex justify-center">
        <q-knob
          :step="1"
          v-model="currentDishProcess.auto_heating_temp"
          show-value
          size="80px"
          :max="70"
          :thickness="0.22"
          color="orange"
          track-color="orange-3"
          :disable="!currentDishProcess.auto_heating"
          class="text-orange"
        />
      </div>
    </div>

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
      class="q-px-none q-mt-md"
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
        color="grey-7"
        label="Отменить приготовление"
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

<style scoped></style>

<script lang="ts">
import { defineComponent } from 'vue';
//import type { IDish } from 'src/models/Dish';
import GalleryImg from 'components/GalleryImg.vue';
import { useDish } from 'stores/appStore';
import { storeToRefs } from 'pinia';
import { splitIngredients } from 'src/utils/dish';
import AppTimer from 'components/AppTimer.vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'СookingProcessPage',
  components: {
    GalleryImg,
    AppTimer,
  },
  setup() {
    const dishStore = useDish();
    const $q = useQuasar();
    const { currentDishProcess, cooking } = storeToRefs(dishStore);

    function startCooking() {
      dishStore.startCooking(currentDishProcess.value);
    }

    function stopCooking() {
      /**/
    }

    function onDeleteClick() {
      $q.dialog({
        title: 'Подтвердите',
        message: 'Вы действительно хотите это блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        // dish.value.imageData.images.forEach((image) => {
        //   S3.Delete(image.fileName, import.meta.env.VITE_S3_IMG_DIR);
        // });
        // dishStore.newDish();
      });
    }

    return {
      currentDishProcess,
      splitIngredients,
      cooking,
      startCooking,
      stopCooking,
      onDeleteClick,
    };
  },
});
</script>

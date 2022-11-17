<template>
  <q-page class="column q-pa-lg" style="gap: 1.4rem">
    <div class="text-h5 text-center">{{ currentDishProcess.title }}</div>
    <GalleryImg :image-data="currentDishProcess.imageData" />
    <div
      class="text-body1 text-weight-bolder row items-center justify-center ingredient-list"
    >
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
      class="text-body1 text-grey-7"
      style="white-space: pre-line; text-align: justify"
    >
      {{ currentDishProcess.description }}
    </div>

    <q-separator inset />

    <TempSettingControls
      :cooking-data="{
        cooking_temperature: toRef(cooking, 'cooking_temperature'),
        auto_heating: toRef(cooking, 'auto_heating'),
        auto_heating_temp: toRef(cooking, 'auto_heating_temp'),
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
        v-else
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
import { defineComponent, toRef } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import { useDish } from 'stores/appStore';
import { storeToRefs } from 'pinia';
import { splitIngredients } from 'src/utils/dish';
import AppTimer from 'components/AppTimer.vue';
import { useQuasar } from 'quasar';
import TempSettingControls from 'components/TSetCtrls.vue';
import { onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
  name: 'CookingProcessPage',
  components: {
    TempSettingControls,
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

    onBeforeRouteLeave(() => {
      dishStore.resetCookingProcessData();

      return true;
    });

    return {
      currentDishProcess,
      splitIngredients,
      cooking,
      startCooking,
      stopCooking,
      onDeleteClick,
      toRef,
    };
  },
});
</script>

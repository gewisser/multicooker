<template>
  <q-page class="column q-pa-lg" style="gap: 1.4rem">
    <div class="text-h5 text-center">{{ currentDishProcess.title }}</div>
    <GalleryImg :image-data="currentDishProcess.imageData" />
    <div
      class="text-body1 text-weight-bolder row items-center justify-center ingredient-list"
    >
      <q-icon name="app:production_quantity_limits" size="18px" />
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

    <TimersBlock
      :start-cooking-time="cooking.start_cooking_time"
      :start-total-time="cooking.start_total_time"
    />

    <q-card-actions
      class="q-px-none q-mt-md"
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
        v-else
        padding="10px 16px"
        icon="app:stop_circle"
        class="glossy"
        rounded
        color="grey-7"
        label="Отменить приготовление"
        @click="stopCooking"
      />
      <q-btn
        icon="app:delete_forever"
        flat
        label="Удалить"
        color="deep-orange"
        @click="onDeleteClick"
      />
    </q-card-actions>
  </q-page>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import GalleryImg from 'components/GalleryImg.vue';
import { useDish } from 'stores/dish';
import { storeToRefs } from 'pinia';
import { splitIngredients } from 'src/utils/dish';
import { useQuasar } from 'quasar';
import TempSettingControls from 'components/TSetCtrls.vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import TimersBlock from 'components/TimersBlock.vue';

export default defineComponent({
  name: 'CookingProcessPage',
  components: {
    TimersBlock,
    TempSettingControls,
    GalleryImg,
  },
  setup() {
    const dishStore = useDish();
    const $q = useQuasar();
    const router = useRouter();

    const { currentDishProcess, cooking } = storeToRefs(dishStore);

    function startCooking() {
      dishStore.startCooking();
    }

    function stopCooking() {
      /**/
    }

    function onDeleteClick() {
      $q.dialog({
        title: 'Подтвердите',
        message: 'Вы действительно хотите удалить это блюдо?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await dishStore.deleteDish();
          $q.notify({
            type: 'success',
            message: 'Блюдо успешно удалено',
          });

          router.push('/').then();
        } catch (e) {
          $q.notify({
            type: 'error',
            message: 'При удалении что-то пошло не так',
          });
        }
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

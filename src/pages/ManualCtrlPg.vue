<template>
  <q-page class="row items-center justify-evenly q-pa-lg">
    <div class="column q-pa-lg" style="gap: 1.4rem">
      <div class="text-body2 text-center q-mb-md">
        В этом разделе Вы сможете управлять вашей мультиваркой в ручном режиме
      </div>
      <TempSettingControls
        :cooking-data="{
          cooking_temperature: toRef(cooking, 'cooking_temperature'),
          auto_heating: toRef(cooking, 'auto_heating'),
          auto_heating_temp: toRef(cooking, 'auto_heating_temp'),
        }"
        hidden-heating-temp
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
          label="Остановить приготовление"
          @click="stopCooking"
        />
      </q-card-actions>
    </div>
  </q-page>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import TempSettingControls from 'components/TSetCtrls.vue';
import TimersBlock from 'components/TimersBlock.vue';
import { storeToRefs } from 'pinia';
import { useDish } from 'stores/dish';

export default defineComponent({
  name: 'ManualControlPage',
  components: { TimersBlock, TempSettingControls },
  setup() {
    const dishStore = useDish();
    const { cooking } = storeToRefs(dishStore);

    function startCooking() {
      dishStore.startCooking();
    }

    function stopCooking() {
      dishStore.stopCooking();
    }

    return {
      toRef,
      cooking,
      startCooking,
      stopCooking,
    };
  },
});
</script>

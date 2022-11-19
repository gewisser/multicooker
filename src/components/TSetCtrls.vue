<template>
  <div class="row items-center" style="margin-top: -1rem">
    <div
      class="flex justify-center"
      :class="{ 'col-6': !hiddenHeatingTemp, 'col-12': hiddenHeatingTemp }"
    >
      <div class="text-subtitle1 text-grey-6">T° приготовления</div>
    </div>
    <div v-if="!hiddenHeatingTemp" class="col-6 flex justify-center">
      <q-toggle keep-color dense size="38px" v-model="auto_heating">
        <span class="text-subtitle1 text-grey-6">T° подогрева</span>
      </q-toggle>
    </div>
  </div>

  <div class="row items-center" style="margin-top: -1rem">
    <div
      class="flex justify-center"
      :class="{ 'col-6': !hiddenHeatingTemp, 'col-12': hiddenHeatingTemp }"
    >
      <q-knob
        :step="1"
        v-model="cooking_temperature"
        show-value
        size="120px"
        :max="300"
        :thickness="0.22"
        color="deep-orange"
        track-color="deep-orange-3"
        class="text-orange"
      />
    </div>
    <div v-if="!hiddenHeatingTemp" class="col-6 flex justify-center">
      <q-knob
        :step="1"
        v-model="auto_heating_temp"
        show-value
        size="80px"
        :max="70"
        :thickness="0.22"
        color="orange"
        track-color="orange-3"
        :disable="!auto_heating"
        class="text-orange"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Ref, PropType } from 'vue';

export interface ICookingData {
  auto_heating: Ref<boolean>;
  cooking_temperature: Ref<number>;
  auto_heating_temp: Ref<number>;
}

export default defineComponent({
  name: 'TempSettingControls',
  props: {
    cookingData: {
      type: Object as PropType<ICookingData>,
      required: true,
    },
    hiddenHeatingTemp: { type: Boolean, default: false },
  },
  setup(props) {
    const { auto_heating, cooking_temperature, auto_heating_temp } =
      props.cookingData || {
        auto_heating: ref(false),
        cooking_temperature: ref(0),
        auto_heating_temp: ref(0),
      };

    return {
      auto_heating,
      cooking_temperature,
      auto_heating_temp,
    };
  },
});
</script>

<route>
{
  path: ''
}
</route>

<template>
  <q-page class="row items-center justify-evenly">
    <q-knob
      :step="1"
      v-model="knobVal"
      show-value
      size="90px"
      :max="300"
      :thickness="0.22"
      color="orange"
      track-color="orange-3"
      class="text-orange q-ma-md"
    />

    <SvgUse icon="menu1" width="100px" height="auto"></SvgUse>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SvgUse from 'components/SvgUse.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { SvgUse },
  setup() {
    const knobVal = ref(0);

    return {
      knobVal,
    };
  },
});
</script>

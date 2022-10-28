<route>
{
  path: ''
}
</route>

<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const knobVal = ref(0);

    return {
      knobVal,
    };
  },
});
</script>

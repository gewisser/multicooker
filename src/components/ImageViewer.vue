<template>
  <q-dialog class="image-viewer" maximized>
    <div class="col-auto full-width">
      <q-img
        :src="img"
        fit="contain"
        placeholder-src="~assets/image_placeholder.svg"
      >
      </q-img>
    </div>

    <q-btn rounded flat dense color="white" icon="sym_o_close" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageViewer',
  props: {
    img: {
      type: String,
      default: undefined,
    },
  },

  setup() {
    return {};
  },
});
</script>

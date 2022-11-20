<template>
  <q-dialog class="image-viewer" maximized>
    <div class="col-auto full-width">
      <q-img :src="img" fit="contain" :placeholder-src="image_placeholder">
      </q-img>
    </div>

    <q-btn rounded flat dense color="white" icon="app:close" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import image_placeholder from 'src/assets/image_placeholder.svg';

export default defineComponent({
  name: 'ImageViewer',
  props: {
    img: {
      type: String,
      default: undefined,
    },
  },

  setup() {
    return {
      image_placeholder,
    };
  },
});
</script>

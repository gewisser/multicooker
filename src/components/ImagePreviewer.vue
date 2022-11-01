<template>
  <q-img v-bind="$attrs" @click="showImgFull">
    <template
      v-for="slot in getSlots(Object.keys($slots))"
      v-slot:[slot]="scope"
    >
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </q-img>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModals } from 'src/composables/useModals';
import imageViewer from 'components/ImageViewer.vue';

export default defineComponent({
  name: 'ImagePreviewer',
  props: {
    imgHighGuality: {
      type: String,
      default: undefined,
    },
  },

  setup(props) {
    const modal = useModals();

    function showImgFull() {
      modal.show(imageViewer, {
        compAttrs: {
          img: props.imgHighGuality,
        },
      });
    }

    // lint error fix
    function getSlots(slots: string[]) {
      return slots as unknown as ['error', 'loading', 'default'];
    }

    return {
      showImgFull,
      getSlots,
    };
  },
});
</script>

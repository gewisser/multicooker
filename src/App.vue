<template>
  <AppModals />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import AppModals from 'components/AppModals.vue';

export default defineComponent({
  name: 'App',
  components: { AppModals },
  setup() {
    const $q = useQuasar();

    $q.iconMapFn = (iconId) => {
      if (iconId.startsWith('app:')) {
        const name = iconId.substring(4);

        return {
          icon: `svguse:/icons.svg#${name}`,
        };
      }
    };
  },
});
</script>

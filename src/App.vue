<template>
  <AppModals />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import AppModals from 'components/AppModals.vue';
import { BeforeInstallPromptEvent } from 'src/env';

export default defineComponent({
  name: 'App',
  components: { AppModals },
  setup() {
    let deferredPrompt: BeforeInstallPromptEvent;

    const $q = useQuasar();

    $q.iconMapFn = (iconId) => {
      if (iconId.startsWith('app:')) {
        const name = iconId.substring(4);

        return {
          icon: `svguse:/icons.svg#${name}`,
        };
      }
    };

    function showNotifySetup() {
      $q.notify({
        message: 'Установить приложеие?',
        color: 'primary',
        timeout: 10000,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        actions: [
          {
            label: 'Да',
            color: 'yellow',
            handler: () => {
              deferredPrompt.prompt();
            },
          },
          {
            label: 'Нет',
            color: 'white',
            handler: () => {
              /* ... */
            },
          },
        ],
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();

      deferredPrompt = e;

      showNotifySetup();
    });
  },
});
</script>

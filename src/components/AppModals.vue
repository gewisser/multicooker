<template>
  <div>
    <component
      :is="modal.component"
      v-for="modal in modals.items"
      :key="modal.name"
      v-bind="modal.compAttrs || {}"
      v-model="modal.show"
      v-on="modal.compListeners || {}"
      @hide="handleRemove(modal)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModals } from 'src/composables/useModals';

interface modalEvent {
  show: boolean;
  name: string;
}

export default defineComponent({
  name: 'AppModals',
  setup() {
    const modals = useModals();

    const handleRemove = (event: modalEvent) => {
      event.show = false;
      modals.remove(event.name);
    };

    return {
      modals,
      handleRemove,
    };
  },
});
</script>

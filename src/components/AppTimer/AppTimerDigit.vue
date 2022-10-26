<template>
  <div class="flex app-timer-digit items-end">
    <div v-if="showDot" class="app-timer-dot"></div>
    <div class="flex items-center justify-center app-timer-box">
      <div class="app-timer-symbol text-weight-bold">{{ digit }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-timer-digit {
  column-gap: 0.25rem;
}

.app-timer-dot {
  border-radius: 50%;
  background: var(--q-secondary);
  width: 0.35em;
  height: 0.35em;
  margin-bottom: 0.5em;
}

.app-timer-box {
  width: 1.7em;
  height: 2.2em;
  background: var(--q-primary);
  border-radius: 0.5em;
}

.app-timer-symbol {
  font-size: 1.4em;
  line-height: 1;
  color: var(--q-white);
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'AppTimerDigit',
  props: {
    showDot: {
      type: Boolean,
      default: false,
    },
    digit: {
      type: [String, Number] as PropType<string | number>,
      default: 0,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="column items-center group-set">
    <div class="column items-center">
      <div class="text-grey-6">Общее время приготовления</div>
      <AppTimer :model-value="startTotalTime" style="font-size: 16px" />
    </div>
    <div class="column items-center">
      <div class="text-grey-6 text-center">
        Время приготовления<br />от достижения заданной температуры
      </div>
      <AppTimer :model-value="startCookingTime" style="font-size: 16px" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppTimer from 'components/AppTimer.vue';

export default defineComponent({
  name: 'TimersBlock',
  components: { AppTimer },
  props: {
    startTotalTime: { type: Number, default: 0 },
    startCookingTime: { type: Number, default: 0 },
  },
  setup() {
    return {};
  },
});
</script>

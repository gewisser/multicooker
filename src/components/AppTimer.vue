<template>
  <div class="row app-timer">
    <AppTimerDigit :digit="hoursFirst" />
    <AppTimerDigit :digit="hoursSecond" />
    <AppTimerDigit :digit="minutesFirst" show-dot />
    <AppTimerDigit :digit="minutesSecond" />
    <AppTimerDigit :digit="secondsFirst" show-dot />
    <AppTimerDigit :digit="secondsSecond" />
  </div>
</template>

<style scoped>
.app-timer {
  column-gap: 0.25rem;
}
</style>

<script lang="ts">
import { defineComponent, ref, toRef, watch } from 'vue';
import AppTimerDigit from 'components/AppTimer/AppTimerDigit.vue';
import { useStopwatch } from 'vue-timer-hook';

export default defineComponent({
  name: 'AppTimer',
  components: { AppTimerDigit },
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const secondsFirst = ref(0);
    const secondsSecond = ref(0);
    const minutesFirst = ref(0);
    const minutesSecond = ref(0);
    const hoursFirst = ref(0);
    const hoursSecond = ref(0);

    const stopwatch = useStopwatch(
      getSecondsFromStart(props.modelValue),
      props.modelValue > 0
    );

    function getSplitNumb(numb: number) {
      const sStr = String(numb);

      let first = 0;
      let second = 0;

      if (sStr.length > 1) {
        first = Number(sStr[0]) || 0;
        second = Number(sStr[1]) || 0;
      } else {
        first = 0;
        second = Number(sStr[0]) || 0;
      }

      return [first, second];
    }

    function getSecondsFromStart(value: number) {
      if (value === 0) {
        return 0;
      }

      return Math.trunc(new Date().getTime() / 1000) - value;
    }

    watch(toRef(props, 'modelValue'), (value) => {
      stopwatch.reset(getSecondsFromStart(value), value > 0);
    });

    watch(
      stopwatch.seconds,
      (value) => {
        const spl = getSplitNumb(value);

        secondsFirst.value = spl[0];
        secondsSecond.value = spl[1];
      },
      { immediate: true }
    );

    watch(
      stopwatch.minutes,
      (value) => {
        const spl = getSplitNumb(value);

        minutesFirst.value = spl[0];
        minutesSecond.value = spl[1];
      },
      { immediate: true }
    );

    watch(
      stopwatch.hours,
      (value) => {
        const spl = getSplitNumb(value);

        hoursFirst.value = spl[0];
        hoursSecond.value = spl[1];
      },
      { immediate: true }
    );

    return {
      stopwatch,
      secondsFirst,
      secondsSecond,
      minutesFirst,
      minutesSecond,
      hoursFirst,
      hoursSecond,
    };
  },
});
</script>

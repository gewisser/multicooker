import { defineStore } from 'pinia';
import type {
  ICookingProcess,
  IDish,
  TDishStatus,
  TDishSources,
} from 'src/models/Dish';
import { useLocalStorage } from '@vueuse/core';
import { nanoid } from 'nanoid';
import { computed, reactive, ref, watch } from 'vue';
import { api } from 'boot/axios';
import useS3 from 'src/composables/useS3';
import { debounce } from 'quasar';

const NEW_DISH_KEY = 'new-dish';
const VITE_S3_DISH_LIST = import.meta.env.VITE_S3_DISH_LIST;

export const useDish = defineStore('dish', () => {
  const dish = useLocalStorage<IDish>(NEW_DISH_KEY, newDishData());
  const cooking = reactive<ICookingProcess>(newCookingProcessData(''));
  const dishList = ref<IDish[]>([]);
  const S3 = useS3();

  let timerHandle: NodeJS.Timer;

  const currentDishProcess = computed(() => {
    return dishList.value.find((dish) => dish.id === cooking.id) || dish.value;
  });

  const dishStatus = computed<TDishStatus>(() => {
    if (cooking.start_cooking_time > 0) {
      return 'cooking';
    }

    if (cooking.start_total_time > 0) {
      return 'heat';
    }

    return 'waiting';
  });

  const dishSources = computed<TDishSources>(() => {
    if (currentDishProcess.value.id !== dish.value.id) {
      return 'saved_dish';
    }

    return 'new_dish';
  });

  const sendProgramToESPDeb = debounce(sendProgramToESP, 700);

  watch(cooking, (value) => {
    sendProgramToESPDeb(value);
  });

  function sendProgramToESP(data: ICookingProcess) {
    console.log('sent to ESP-32', data);
  }

  function newCookingProcessData(id: string): ICookingProcess {
    return {
      id,
      current_temperature: 20,
      start_cooking_time: 0,
      start_total_time: 0,
      auto_heating: true,
      auto_heating_temp: 40,
      cooking_temperature: 100,
    };
  }

  function newDishData(): IDish {
    return {
      id: nanoid(),
      imageData: {
        homeImgUrl: undefined,
        images: [],
      },
      title: '',
      stars: 0,
      ingredients: '',
      description: '',
      auto_heating: true,
      auto_heating_temp: 40,
      cooking_temperature: 100,
      total_cooking_time: 0,
      heating_cooking_time: 0,
    };
  }

  function newDish() {
    clearInterval(timerHandle);

    dish.value = newDishData();
    resetCookingProcessData(dish);
  }

  function resetCookingProcessData(dishData = dish) {
    Object.assign(cooking, newCookingProcessData(dishData.value.id));
  }

  async function getDishList() {
    try {
      const { data, status } = await api.get<IDish[]>(
        `/${import.meta.env.VITE_S3_BUCKET}/${VITE_S3_DISH_LIST}`
      );

      if (status === 200) {
        dishList.value = data;
      }
    } catch (e) {}
  }

  async function saveDishList() {
    await S3.Upload(
      {
        file: Uint8Array.from(
          new TextEncoder().encode(JSON.stringify(dishList.value))
        ),
        fileName: VITE_S3_DISH_LIST,
        contentType: 'application/json',
      },
      '/'
    );
  }

  async function saveNewDishToList() {
    const eTime = Math.trunc(new Date().getTime() / 1000);

    dish.value.total_cooking_time = eTime - cooking.start_total_time;

    dish.value.heating_cooking_time = eTime - cooking.start_cooking_time;

    dishList.value.push(dish.value);

    await saveDishList();
  }

  function startCooking(applyDish: IDish | undefined) {
    if (!applyDish) {
      return;
    }

    cooking.id = applyDish.id;
    cooking.start_total_time = Math.trunc(new Date().getTime() / 1000);
    cooking.current_temperature = 20;
    cooking.auto_heating = applyDish.auto_heating;
    cooking.auto_heating_temp = applyDish.auto_heating_temp;
    cooking.cooking_temperature = applyDish.cooking_temperature;

    // sent cooking obj to ESP-32
    sendProgramToESP(cooking);

    timerHandle = setInterval(() => {
      cooking.current_temperature = cooking.current_temperature + 5;

      if (
        cooking.current_temperature >= dish.value.cooking_temperature &&
        cooking.start_cooking_time === 0
      ) {
        cooking.start_cooking_time = Math.trunc(new Date().getTime() / 1000);
        clearInterval(timerHandle);
      }
    }, 700);
  }

  async function deleteDish(id?: string) {
    if (!id) {
      id = currentDishProcess.value.id;
    }

    const dishId = dishList.value.findIndex((dish) => dish.id === id);

    if (dishId === -1) {
      console.warn('dish not found');
      return;
    }

    dishList.value.splice(dishId, 1);

    await saveDishList();
  }

  return {
    dish,
    newDish,
    cooking,
    dishList,
    getDishList,
    saveNewDishToList,
    startCooking,
    saveDishList,
    currentDishProcess,
    dishStatus,
    dishSources,
    resetCookingProcessData,
    deleteDish,
  };
});

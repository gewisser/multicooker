import { defineStore } from 'pinia';
import { ICookingProcess, IDish } from 'src/models/Dish';
import { useLocalStorage } from '@vueuse/core';
import { nanoid } from 'nanoid';
import { reactive, ref } from 'vue';
import { api } from 'boot/axios';
import useS3 from 'src/composables/useS3';

const NEW_DISH_KEY = 'new-dish';
const VITE_S3_DISH_LIST = import.meta.env.VITE_S3_DISH_LIST;

export const useDish = defineStore('dish', () => {
  const dish = useLocalStorage<IDish>(NEW_DISH_KEY, newDishData());
  const cooking = reactive<ICookingProcess>(newCookingProcessData(''));
  const dishList = ref<IDish[]>([]);
  const S3 = useS3();

  let timerHandle: NodeJS.Timer;

  function newCookingProcessData(id: string): ICookingProcess {
    return {
      id,
      current_temperature: 20,
      start_cooking_time: 0,
      start_total_time: 0,
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
    Object.assign(cooking, newCookingProcessData(dish.value.id));
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

  async function saveNewDishToList() {
    const eTime = Math.trunc(new Date().getTime() / 1000);

    dish.value.total_cooking_time = eTime - cooking.start_total_time;

    dish.value.heating_cooking_time = eTime - cooking.start_cooking_time;

    dishList.value.push(dish.value);

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

  function startCooking() {
    cooking.start_total_time = Math.trunc(new Date().getTime() / 1000);
    cooking.current_temperature = 20;

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

  return {
    dish,
    newDish,
    cooking,
    dishList,
    getDishList,
    saveNewDishToList,
    startCooking,
  };
});

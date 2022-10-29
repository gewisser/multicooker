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
  const cooking = reactive<ICookingProcess>(newCookingProcessData());
  const dishList = ref<IDish[]>([]);
  const S3 = useS3();

  function newCookingProcessData() {
    return {
      cooking_time: 0,
      current_temperature: 20,
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
      total_time: 0,
      saved_cooking_time: 0,
    };
  }

  function newDish() {
    dish.value = newDishData();
    Object.assign(cooking, newCookingProcessData());
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

  async function saveToDishList(dish: IDish) {
    dishList.value.push(dish);

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

  return {
    dish,
    newDish,
    cooking,
    dishList,
    getDishList,
    saveToDishList,
  };
});

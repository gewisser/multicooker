import { defineStore } from 'pinia';
import { IDish } from 'src/models/Dish';
import { useLocalStorage } from '@vueuse/core';
import { nanoid } from 'nanoid';

const NEW_DISH_KEY = 'new-menu';

export const useDish = defineStore('dish', () => {
  const dish = useLocalStorage<IDish>(NEW_DISH_KEY, getDish());

  function getDish() {
    return {
      id: nanoid(),
      imageData: {
        homeImgUrl: undefined,
        images: [],
      },
      description: '',
      cooking_temperature: 100,
      cooking_time: 0,
      auto_heating: true,
      auto_heating_temp: 40,
    };
  }

  function newDish() {
    dish.value = getDish();
  }

  return {
    dish,
    newDish,
  };
});

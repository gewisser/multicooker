<route>
{
  path: ''
}
</route>

<template>
  <q-page class="column q-pa-lg form-page">
    <q-card v-for="dish in dishList" class="my-card" :key="dish.id">
      <q-img
        :src="dish.imageData.homeImgUrl || image_placeholder"
        alt="Фото блюда"
        :ratio="16 / 9"
        placeholder-src="~assets/image_placeholder.svg"
      >
        <template v-slot:error>
          <div class="absolute-full column flex-center bg-negative text-white">
            <span>Не удалось загрузить изображение</span><br />
            <q-icon name="sym_o_mood_bad" size="48px"></q-icon>
          </div>
        </template>
      </q-img>

      <q-card-section>
        <q-btn
          fab
          color="deep-orange"
          icon="sym_o_cooking"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ dish.title }}</div>
        </div>

        <q-rating
          v-model="dish.stars"
          :max="5"
          size="32px"
          icon="sym_o_grade"
          icon-selected="sym_o_grade"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1 row items-center ingredient-list">
          <q-icon name="sym_o_production_quantity_limits" size="18px" />
          <div
            class="ingredient-list-item"
            v-for="ingredient in splitIngredients(dish.ingredients)"
            :key="ingredient"
          >
            {{ ingredient }}
          </div>
        </div>
        <div
          class="text-caption text-grey-7 q-mt-md"
          :class="{ 'clamp-description': dish.id !== clampId }"
          style="white-space: pre-line"
        >
          {{ dish.description }}
        </div>
        <q-btn
          v-if="dish.id !== clampId"
          class="more-btn full-width"
          flat
          no-caps
          no-wrap
          color="primary"
          padding="0"
          @click="clampId = dish.id"
          >...</q-btn
        >
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md">
        <div class="text-caption">Время приготовления ≈</div>
        <div>&nbsp;{{ formatDuration(dish.total_cooking_time) }}</div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">
.ingredient-list > .ingredient-list-item {
  &:before {
    content: '•';
    padding-right: 5px;
    padding-left: 5px;
  }

  text-transform: capitalize;
}

.clamp-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
}

.more-btn {
  display: inline-flex;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDish } from 'stores/appStore';
import { storeToRefs } from 'pinia';
import { Duration } from 'luxon';

import image_placeholder from 'src/assets/image_placeholder.svg';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const dishStore = useDish();
    const { dishList } = storeToRefs(dishStore);

    const knobVal = ref(0);
    const stars = ref(0);
    const clampId = ref('');

    function splitIngredients(ingredients: string) {
      return ingredients.split(',').map((ingredient) => {
        return ingredient.trim();
      });
    }

    function formatDuration(second: number) {
      return Duration.fromObject({ second }).toFormat('hh:mm');
    }

    return {
      knobVal,
      stars,
      dishList,
      image_placeholder,
      splitIngredients,
      clampId,
      formatDuration,
    };
  },
});
</script>

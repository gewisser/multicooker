<route>
{
  path: ''
}
</route>

<template>
  <q-page
    v-if="!dishList.length"
    class="row items-center justify-evenly q-pa-lg"
  >
    <div class="column items-center" style="gap: 12px">
      <q-icon color="bg" name="app:restaurant_menu" size="8rem" />
      <div class="text-subtitle1 text-center">
        У Вас нет ещё ни одного блюда
      </div>
      <q-btn
        outline
        color="primary"
        label="Создать блюдо"
        :to="{ name: 'CreateDishPage' }"
      />
    </div>
  </q-page>
  <q-page v-else class="column q-pa-lg form-page no-wrap">
    <q-card v-for="dish in dishList" class="my-card" :key="dish.id">
      <ImagePreviewer
        :src="dish.imageData.homeImgUrl || image_placeholder"
        :img-high-guality="dish.imageData.homeImgUrl || image_placeholder"
        alt="Фото блюда"
        :ratio="16 / 9"
        :placeholder-src="image_placeholder"
      >
        <template v-slot:error>
          <div class="absolute-full column flex-center bg-negative text-white">
            <span>Не удалось загрузить изображение</span><br />
            <q-icon name="app:mood_bad" size="48px"></q-icon>
          </div>
        </template>
      </ImagePreviewer>

      <q-card-section>
        <q-btn
          rounded
          size="lg"
          padding="8px"
          color="deep-orange"
          icon="app:play_pause"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
          @click.stop="applyDish(dish)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h5 ellipsis">{{ dish.title }}</div>
        </div>

        <q-rating
          v-model="dish.stars"
          @update:model-value="onRatingChange"
          :max="5"
          size="32px"
          icon="app:grade"
          icon-selected="app:grade-fill"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2 row items-center ingredient-list">
          <q-icon name="app:production_quantity_limits" size="18px" />
          <div
            class="ingredient-list-item"
            v-for="ingredient in splitIngredients(dish.ingredients)"
            :key="ingredient"
          >
            {{ ingredient }}
          </div>
        </div>
        <div
          class="text-body2 text-grey-7 q-mt-md"
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

      <q-card-actions class="q-pa-md text-block-space">
        <div class="text-caption col-auto">Время приготовления</div>
        <div class="text-caption col-auto">≈</div>
        <div class="col-auto">
          {{ formatDuration(dish.total_cooking_time) }}
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">
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
import { useDish } from 'stores/dish';
import { storeToRefs } from 'pinia';
import { Duration } from 'luxon';
import { debounce } from 'quasar';
import { useRouter } from 'vue-router';

import image_placeholder from 'src/assets/image_placeholder.svg';
import ImagePreviewer from 'components/ImagePreviewer.vue';
import { IDish } from 'src/models/Dish';
import { splitIngredients } from 'src/utils/dish';

export default defineComponent({
  name: 'IndexPage',
  components: { ImagePreviewer },
  setup() {
    const dishStore = useDish();
    const router = useRouter();

    const { dishList } = storeToRefs(dishStore);

    const knobVal = ref(0);
    const stars = ref(0);
    const clampId = ref('');

    function formatDuration(second: number) {
      return Duration.fromObject({ second }).toFormat('hh:mm');
    }

    const onRatingChange = debounce(() => {
      dishStore.saveDishList();
    }, 4000);

    function applyDish(dish: IDish) {
      dishStore.applyDishSettings(dish);
      router.push({ name: 'CookProcPg' }).then();
    }

    return {
      knobVal,
      stars,
      dishList,
      image_placeholder,
      splitIngredients,
      clampId,
      formatDuration,
      onRatingChange,
      applyDish,
    };
  },
});
</script>

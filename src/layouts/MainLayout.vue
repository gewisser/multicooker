<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="app:menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <img
            src="~assets/logo.svg"
            style="width: auto; height: 55px; padding-top: 10px"
          />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="justify">
        <q-route-tab
          class="round-top-focus"
          :disable="cooking.start_cooking_time > 0"
          icon="app:menu_book"
          :to="{ name: 'IndexPage' }"
          label="Блюда"
        />
        <q-route-tab
          class="round-top-focus"
          icon="app:assignment_add"
          :to="{ name: 'CreateDishPage' }"
          label="Создать"
        />
        <q-route-tab
          class="round-top-focus"
          :disable="cooking.start_cooking_time > 0"
          icon="app:engineering"
          :to="{ name: 'ManualCtrlPg' }"
          label="я сам"
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <q-list padding>
        <q-item-label header>Настройки</q-item-label>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Wi-Fi</q-item-label>
            <q-item-label caption>
              Настройка пароля и логина подключения к Вашей точке доступа
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>ПИД регулятор</q-item-label>
            <q-item-label caption>
              Настройки коэффициентов пид регуляора нагревателя
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-bg text-text">
      <q-toolbar class="justify-between text-body1">
        <div>{{ stauses }}</div>
        <div class="flex text-h6 items-center" style="column-gap: 6px">
          <q-icon name="app:thermostat_auto" size="32px" />
          <div>{{ cooking.current_temperature }}</div>
          <div>°C</div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useDish } from 'stores/appStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    const dishStore = useDish();
    const { dish, cooking, dishStatus } = storeToRefs(dishStore);

    dishStore.getDishList().then();

    const stauses = computed(() => {
      switch (dishStatus.value) {
        case 'cooking':
          return 'Приготовление...';
        case 'heat':
          return 'Нагрев мультиварки...';
      }

      return 'В ожидани';
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      dish,
      stauses,
      cooking,
    };
  },
});
</script>

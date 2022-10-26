<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <img
            src="~assets/logo.svg"
            style="width: auto; height: 55px; padding-top: 10px"
          />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="justify">
        <q-route-tab
          icon="menu_book"
          :to="{ name: 'IndexPage' }"
          label="Блюда"
        />
        <q-route-tab
          icon="assignment_add"
          :to="{ name: 'CreateMenuPage' }"
          label="Создать"
        />
        <q-route-tab
          icon="engineering"
          :to="{ name: 'ManualControlPage' }"
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
      <q-toolbar>
        <q-toolbar-title>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
//import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

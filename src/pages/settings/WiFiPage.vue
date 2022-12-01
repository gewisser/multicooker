<template>
  <q-page class="row items-center justify-evenly q-pa-lg">
    <q-spinner-radio v-if="isFetch" color="primary" size="2em" />
    <form
      v-else
      class="column items-center form-page"
      @submit="onSubmit"
      style="width: 80vw"
    >
      <div class="text-h5 text-center">Настройки WiFi</div>
      <Field name="apMode" v-slot="{ handleChange, value }">
        <q-select
          :model-value="value"
          @update:model-value="handleChange"
          class="full-width"
          outlined
          emit-value
          map-options
          :options="modesSelect"
          label="Режим точки доступа"
          option-value="value"
          option-label="label"
          dropdown-icon="app:arrow_drop_down"
        />
      </Field>

      <Field
        v-if="
          values.apMode === EWifiMode.WIFI_MODE_STA ||
          values.apMode === EWifiMode.WIFI_MODE_APSTA
        "
        name="ssid"
        v-slot="{ handleChange, value }"
      >
        <q-select
          :model-value="value"
          @update:model-value="handleChange"
          class="full-width"
          outlined
          emit-value
          map-options
          :options="networks"
          label="Выбирите точку для подключения"
          :loading="isNetworkScan"
          :readonly="isNetworkScan"
          option-value="ssid"
          option-label="ssid"
          dropdown-icon="app:arrow_drop_down"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.ssid }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label
                  class="flex items-center justify-center"
                  style="gap: 0.5rem"
                  >RSSI: {{ scope.opt.rssi }}
                  <q-icon v-if="!scope.opt.opened" name="app:wifi_password" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </Field>

      <Field
        v-if="
          values.apMode === EWifiMode.WIFI_MODE_APSTA ||
          values.apMode === EWifiMode.WIFI_MODE_AP
        "
        name="softAP"
        v-slot="{ handleChange, value }"
      >
        <q-input
          :model-value="value"
          @update:model-value="handleChange"
          class="full-width"
          outlined
          label="SSID вашей точки доступа"
        />
      </Field>

      <Field name="password" v-slot="{ handleChange, value }">
        <q-input
          :model-value="value"
          @update:model-value="handleChange"
          class="full-width"
          outlined
          label="Пароль точки доступа"
        />
      </Field>

      <q-btn
        type="submit"
        color="primary"
        label="Сохранить настройки"
        :disabled="isFetch || isSubmitting || !meta.dirty || !meta.valid"
      />
    </form>
  </q-page>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useForm, Field } from 'vee-validate';
import esp32Api from 'src/api/esp32.api';

import type { IWiFiForm } from 'src/models/WiFi';
import { EWifiMode } from 'src/models/WiFi';
import { enumToArray } from 'src/utils/t_utils';
import useScanWiFi from 'src/composables/useScanWiFi';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'WiFiPage',
  components: {
    Field,
  },
  setup() {
    const $q = useQuasar();

    const { networks, isNetworkScan } = useScanWiFi();
    const isFetch = ref(false);

    const { handleSubmit, isSubmitting, values, meta } = useForm<IWiFiForm>({
      validationSchema: {
        apMode: 'required',
      },
    });

    const modesSelect = enumToArray(EWifiMode, [
      'Клиент',
      'Точка доступа',
      'Смешанный режим',
    ]);

    const onSubmit = handleSubmit(async (values) => {
      try {
        await esp32Api.setWiFiSettings(values);

        $q.notify({
          type: 'success',
          message: 'Настройки успешно сохранены',
        });
      } catch (e) {
        console.error(e);
      }
    });

    async function getSettings() {
      isFetch.value = true;

      try {
        const { data, status } = await esp32Api.fetchWiFiSettings();

        if (status !== 200) {
          return;
        }

        Object.assign(values, data);
      } catch (e) {
        console.error(e);
      } finally {
        isFetch.value = false;
      }
    }

    (() => {
      getSettings().then();
    })();

    return {
      onSubmit,
      isSubmitting,
      modesSelect,
      values,
      meta,
      isFetch,
      networks,
      isNetworkScan,
      EWifiMode,
    };
  },
});
</script>

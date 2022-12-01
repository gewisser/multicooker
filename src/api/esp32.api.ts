import { api } from 'boot/axios';
import type { IWiFiForm, IScanResult } from 'src/models/WiFi';

export default {
  async fetchWiFiSettings() {
    return api.get<IWiFiForm>('/wifi');
  },

  async setWiFiSettings(payload: IWiFiForm) {
    return api.put('/wifi', payload);
  },

  async fetchWiFiNetworks() {
    return api.get<IScanResult[]>('/wifi/scan');
  },
};

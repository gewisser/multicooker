export enum EWifiMode {
  WIFI_MODE_STA = 1,
  WIFI_MODE_AP,
  WIFI_MODE_APSTA,
}

export interface IWiFiForm {
  apMode: EWifiMode;
  ssid: string;
  softAP: string;
  password: string;
}

export interface IScanResult {
  ssid: string;
  rssi: number;
  opened: boolean;
}

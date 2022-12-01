import { IScanResult } from 'src/models/WiFi';
import { computed, onUnmounted, ref } from 'vue';
import esp32Api from 'src/api/esp32.api';

const scan = () => {
  let timerHandle: NodeJS.Timer;
  const networks = ref<IScanResult[]>([]);

  const isNetworkScan = computed(() => {
    return !networks.value.length;
  });

  async function fetchWiFiNetworks() {
    try {
      const { status, data } = await esp32Api.fetchWiFiNetworks();

      if (status !== 200) {
        return;
      }

      data.forEach((network) => {
        const networkExist = networks.value.find(
          (item) => item.ssid === network.ssid
        );

        if (networkExist) {
          networkExist.rssi = network.rssi;
        } else {
          networks.value.push(network);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function startRescan() {
    fetchWiFiNetworks().then();

    if (timerHandle) {
      clearInterval(timerHandle);
    }

    timerHandle = setInterval(() => {
      fetchWiFiNetworks().then();
    }, 8000);
  }

  function stopRescan() {
    if (timerHandle) {
      clearInterval(timerHandle);
    }
  }

  onUnmounted(() => {
    stopRescan();
  });

  (() => {
    startRescan();
  })();

  return {
    networks,
    startRescan,
    stopRescan,
    isNetworkScan,
  };
};

export default scan;

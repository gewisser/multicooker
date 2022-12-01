const char* hostNameAP = "multicooker";

void setupWiFi() {
  StaticJsonDocument<192> wiFiPref;
  
  preferences.begin(preferenceName);
  String wiFiPrefJson = preferences.getString(preferenceKeyWiFi, String("{}"));
  preferences.end();

  DeserializationError error = deserializeJson(wiFiPref, wiFiPrefJson);

  if (error) {
    Serial.print("deserializeJson(wiFiPref) failed: ");
    Serial.println(error.c_str());
    return;
  }

  wifi_mode_t apMode = wiFiPref["apMode"].isNull() ?  WIFI_AP : wiFiPref["apMode"]; 
  const char* password = wiFiPref["password"];
  const char* softAP = wiFiPref["softAP"].isNull() ? hostNameAP : wiFiPref["softAP"];
  const char* ssid = wiFiPref["ssid"];

  WiFi.setHostname(hostname);
  
  WiFi.mode(apMode);

  if (apMode == WIFI_AP || apMode == WIFI_AP_STA) {
    Serial.printf("Create AP: %s\n", softAP);
    WiFi.softAP(softAP, password);
  }

  if (apMode == WIFI_AP_STA || apMode == WIFI_STA) {
    Serial.printf("Trying connect to: %s\n", ssid);
    WiFi.begin(ssid, password);
   

    byte try_count = 0;

    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
      delay(1000); 
      
      Serial.printf("Retry again: %i of 3\n", try_count + 1);
      WiFi.begin(ssid, password);
      try_count++;

      if (try_count > 3) { 
        if (apMode == WIFI_STA) {
          Serial.printf("Create AP: '%s' without pass...\n", softAP);
          WiFi.softAP(softAP);
          
        }

        break;
      }
        
    }      
  }
}
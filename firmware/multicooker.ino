#define CONFIG_ASYNC_TCP_RUNNING_CORE 1
#define CONFIG_ASYNC_TCP_USE_WDT 0

#include <ESPmDNS.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include <WiFi.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "CustomRewrite.h"
#include "CustomResponse.h"
#include "CustomHandlers.h"
#include <Preferences.h>

AsyncWebServer server(80);

const char* preferenceName = "multicooker";
const char* hostname = "multicooker";

const char* preferenceKeyWiFi = "wifi";
Preferences preferences;

StaticJsonDocument<300> cooking;

void setup() {
  cooking["id"] = "";
  cooking["current_temperature"] = 0;
  cooking["start_cooking_time"] = 0;
  cooking["start_total_time"] = 0;
  cooking["auto_heating"] = true;
  cooking["auto_heating_temp"] = 40;
  cooking["cooking_temperature"] = 100;
  cooking["heating_cooking_time"] = 0;

  Serial.begin(115200);
  Serial.setDebugOutput(true);

  setupWiFi(); // WiFiBegin.ino

  if (!MDNS.begin(hostname)) {
      Serial.println("Error setting up MDNS responder!");
      while(1) {
          delay(1000);
      }
  }  

  if(!LittleFS.begin()){
      Serial.println("LittleFS Mount Failed");
      return;
  }  

  setHandlers(); // ServerHandlers.ino
  
  server.begin();
  MDNS.addService("http", "tcp", 80);

  Serial.println("Server starting.");
}

void loop() {
  // put your main code here, to run repeatedly:

}

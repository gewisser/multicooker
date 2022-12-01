void setHandlers() {
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

  server.on("/rest/cooking", HTTP_GET, [](AsyncWebServerRequest *request){
    JsonObject cookingObject = cooking.as<JsonObject>();

    AsyncJsonResponseCustom<JsonObject> * response = new AsyncJsonResponseCustom<JsonObject>(cookingObject);
    // JsonObject root = response->getRoot();
    response->setLength();
    request->send(response);
  });


  server.addHandler(new AsyncCallbackJsonWebHandlerCustom("/rest/cooking", [](AsyncWebServerRequest *request, char* data, size_t total) {
    DeserializationError error = deserializeJson(cooking, (const char*)data, total);

    if(!error) {
      request->send(200);
    }
  }));

  server.on("/rest/wifi/scan", HTTP_GET, [](AsyncWebServerRequest *request){
    StaticJsonDocument<1024> scanDoc;
    JsonArray scanDocArray = scanDoc.to<JsonArray>();

    int n = WiFi.scanComplete();

    if(n == -2){
      WiFi.scanNetworks(true);
    } else if(n){
      
      for (int i = 0; i < n; ++i) {
        JsonObject item = scanDocArray.createNestedObject();
        item["ssid"] = WiFi.SSID(i);
        item["rssi"] = WiFi.RSSI(i);
        item["opened"] = WiFi.encryptionType(i) == WIFI_AUTH_OPEN;
        delay(10);
      }   

      WiFi.scanDelete();

      if(WiFi.scanComplete() == -2){
        WiFi.scanNetworks(true);
      }      
    } 

    AsyncJsonResponseCustom<JsonArray> * response = new AsyncJsonResponseCustom<JsonArray>(scanDocArray);
    response->setLength();
    request->send(response);
  });


  server.on("/rest/wifi", HTTP_GET, [](AsyncWebServerRequest *request){
    preferences.begin(preferenceName);
    String dataJson = preferences.getString(preferenceKeyWiFi, String("{}"));

    request->send(200, JSON_MIMETYPE, dataJson);

    preferences.end();
  });  

  server.on("/rest/reset", HTTP_GET, [](AsyncWebServerRequest *request){
    preferences.begin(preferenceName);
    bool result = preferences.clear();
    preferences.end();

    request->send(result ? 200: 400);
  });

  server.on("/rest/info", HTTP_GET, [](AsyncWebServerRequest *request){
    StaticJsonDocument<300> jsonInfo;
    jsonInfo["freeHeap"] = ESP.getFreeHeap();
    jsonInfo["heapSize"] = ESP.getHeapSize();
    jsonInfo["chipRevision"] = ESP.getChipRevision();
    jsonInfo["ssid"] = WiFi.SSID();
    jsonInfo["localIP"] = WiFi.localIP();

    JsonObject jsonInfoObject = jsonInfo.as<JsonObject>();
    AsyncJsonResponseCustom<JsonObject> * response = new AsyncJsonResponseCustom<JsonObject>(jsonInfoObject);

    response->setLength();
    request->send(response);
  });  

  server.addHandler(new AsyncCallbackJsonWebHandlerCustom("/rest/wifi", [](AsyncWebServerRequest *request, char* data, size_t total) {
    preferences.begin(preferenceName);

    size_t putCount = preferences.putString(preferenceKeyWiFi, String(data));

    preferences.end();

    request->send(putCount > 0 ? 200: 400);

    if (putCount > 0) {
      delay(1000);
      ESP.restart();
    }
  }));


  server.addRewrite( new OneParamRewrite() );  
  server.serveStatic("/", LittleFS, "/");


  server.onNotFound([](AsyncWebServerRequest *request){
    if (request->method() == HTTP_OPTIONS) {
      request->send(200);
      return;
    } 

    Serial.printf("NOT_FOUND: ");
    if(request->method() == HTTP_GET)
      Serial.printf("GET");
    else if(request->method() == HTTP_POST)
      Serial.printf("POST");
    else if(request->method() == HTTP_DELETE)
      Serial.printf("DELETE");
    else if(request->method() == HTTP_PUT)
      Serial.printf("PUT");
    else if(request->method() == HTTP_PATCH)
      Serial.printf("PATCH");
    else if(request->method() == HTTP_HEAD)
      Serial.printf("HEAD");
    else if(request->method() == HTTP_OPTIONS)
      Serial.printf("OPTIONS");
    else
      Serial.printf("UNKNOWN");
    Serial.printf(" http://%s%s\n", request->host().c_str(), request->url().c_str());

    if(request->contentLength()){
      Serial.printf("_CONTENT_TYPE: %s\n", request->contentType().c_str());
      Serial.printf("_CONTENT_LENGTH: %u\n", request->contentLength());
    }

    int headers = request->headers();
    int i;
    for(i=0;i<headers;i++){
      AsyncWebHeader* h = request->getHeader(i);
      Serial.printf("_HEADER[%s]: %s\n", h->name().c_str(), h->value().c_str());
    }

    int params = request->params();
    for(i=0;i<params;i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isFile()){
        Serial.printf("_FILE[%s]: %s, size: %u\n", p->name().c_str(), p->value().c_str(), p->size());
      } else if(p->isPost()){
        Serial.printf("_POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
      } else {
        Serial.printf("_GET[%s]: %s\n", p->name().c_str(), p->value().c_str());
      }
    }

    request->send(404);
  });  
}
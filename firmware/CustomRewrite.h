class OneParamRewrite : public AsyncWebRewrite
{
  protected:
    String _urlPrefix;
    int _paramIndex;
    String _paramsBackup;

  public:
    OneParamRewrite()
      : AsyncWebRewrite(NULL, NULL) {
    }

    bool match(AsyncWebServerRequest *request) override {
      if(request->url().indexOf(".") == -1 && !request->url().startsWith("/rest")) {
        _toUrl = "/index.html";
        return true;
      }
      return false;
    }
};
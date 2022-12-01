typedef std::function<void(AsyncWebServerRequest *request, char* data, size_t total)> ArJsonRequestHandlerFunctionCustom;

class AsyncCallbackJsonWebHandlerCustom: public AsyncWebHandler {
private:
protected:
  const String _uri;
  WebRequestMethodComposite _method;
  ArJsonRequestHandlerFunctionCustom _onRequest;
  size_t _contentLength;
  size_t _maxContentLength;
public:
  AsyncCallbackJsonWebHandlerCustom(const String& uri, ArJsonRequestHandlerFunctionCustom onRequest) 
  : _uri(uri), _method(HTTP_POST|HTTP_PUT|HTTP_PATCH), _onRequest(onRequest), _maxContentLength(16384) {}
  
  void setMethod(WebRequestMethodComposite method){ _method = method; }
  void setMaxContentLength(int maxContentLength){ _maxContentLength = maxContentLength; }
  void onRequest(ArJsonRequestHandlerFunctionCustom fn){ _onRequest = fn; }

  virtual bool canHandle(AsyncWebServerRequest *request) override final{
    if(!_onRequest)
      return false;

    if(!(_method & request->method()))
      return false;

    if(_uri.length() && (_uri != request->url() && !request->url().startsWith(_uri+"/")))
      return false;
  
    if ( !request->contentType().equalsIgnoreCase(JSON_MIMETYPE) )
      return false;

    request->addInterestingHeader("ANY");
    return true;
	
  }

  virtual void handleRequest(AsyncWebServerRequest *request) override final {
    if(_onRequest) {
      if (request->_tempObject != NULL) {
        _onRequest(request, (char*)(request->_tempObject), _contentLength);
        return;
      }
      request->send(_contentLength > _maxContentLength ? 413 : 400);
    } else {
      request->send(500);
    }
  }
  virtual void handleUpload(AsyncWebServerRequest *request, const String& filename, size_t index, uint8_t *data, size_t len, bool final) override final {
  }

  virtual void handleBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) override final {
    if (_onRequest) {
      _contentLength = total;

      if (total > 0 && request->_tempObject == NULL && total < _maxContentLength) {
        request->_tempObject = malloc(total + 1);
      }
      if (request->_tempObject != NULL) {
        memcpy((char *)(request->_tempObject) + index, data, len);
        if(index + len == total){
           *((char *)(request->_tempObject) + total)  = 0x00;
        }        
      }
    }
  }
  virtual bool isRequestHandlerTrivial() override final {return _onRequest ? false : true;}
};
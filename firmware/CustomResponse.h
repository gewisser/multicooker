template <typename T>
class AsyncJsonResponseCustom: public AsyncAbstractResponse {
  protected:
    T _root;
    bool _isValid;

  public:    
    AsyncJsonResponseCustom(T &jsonObject): _isValid{false} {
      _code = 200;
      _contentType = JSON_MIMETYPE;
      _root = jsonObject;
    }

    ~AsyncJsonResponseCustom() {}
    
    T & getRoot() { return _root; }
    
    bool _sourceValid() const { return _isValid; }
    
    size_t setLength() {
      _contentLength = measureJson(_root);

      if (_contentLength) { _isValid = true; }
      return _contentLength;
    }

    size_t getSize() { return _root.size(); }

    size_t _fillBuffer(uint8_t *data, size_t len){
      ChunkPrint dest(data, _sentLength, len);
      serializeJson(_root, dest);
      return len;
    }
};

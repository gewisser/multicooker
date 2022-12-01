// class CustomReader {
//   private:
//     uint8_t *_data;
//     size_t _len;
//     size_t _index;
//     size_t _total;
//     size_t _totalRead;
//   public:
//     CustomReader(uint8_t *data, size_t len, size_t index, size_t total): _data(data), _len(len), _index(index), _total(total), _totalRead(0) {}

//     virtual ~CustomReader(){}

//     // Reads one byte, or returns -1
//     int read(){
//       int oneByte = -1;

//       Serial.println("read");

//       // if (_totalRead <= _len) {
//       //    oneByte = _data[_totalRead];
//       //   _totalRead++;
//       // }

//       return oneByte;
//     }

//     // Reads several bytes, returns the number of bytes read.
//     size_t readBytes(char* buffer, size_t length) {
//       size_t _readCount;
//       size_t remainder = _len - _totalRead;

//       Serial.println(remainder);
      
//       if (length <= remainder) {
//         _readCount = length;        
//       } else {
//         _readCount = remainder; 
//       }

//       memcpy((char*)buffer, _data + _totalRead, _readCount);

//       _totalRead += _readCount;

//       return _readCount;
//     }
// };
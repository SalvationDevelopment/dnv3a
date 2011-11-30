package 
{
    import flash.utils.*;

    public class UploadPostHelper extends Object
    {
        private static var _boundary:String = "";

        public function UploadPostHelper()
        {
            return;
        }// end function

        public static function getBoundary() : String
        {
            var _loc_1:int = 0;
            if (_boundary.length == 0)
            {
                _loc_1 = 0;
                while (_loc_1 < 32)
                {
                    
                    _boundary = _boundary + String.fromCharCode(int(97 + Math.random() * 25));
                    _loc_1++;
                }
            }
            return _boundary;
        }// end function

        public static function getPostData(param1:String, param2:ByteArray, param3:String = "application/octet-stream", param4:Object = null) : ByteArray
        {
            var _loc_5:int = 0;
            var _loc_6:String = null;
            var _loc_8:String = null;
            var _loc_7:* = new ByteArray();
            new ByteArray().endian = Endian.BIG_ENDIAN;
            if (param4 == null)
            {
                param4 = new Object();
            }
            param4.Filename = param1;
            for (_loc_8 in param4)
            {
                
                _loc_7 = BOUNDARY(_loc_7);
                _loc_7 = LINEBREAK(_loc_7);
                _loc_6 = "Content-Disposition: form-data; name=\"" + _loc_8 + "\"";
                _loc_5 = 0;
                while (_loc_5 < _loc_6.length)
                {
                    
                    _loc_7.writeByte(_loc_6.charCodeAt(_loc_5));
                    _loc_5++;
                }
                _loc_7 = LINEBREAK(_loc_7);
                _loc_7 = LINEBREAK(_loc_7);
                _loc_7.writeUTFBytes(param4[_loc_8]);
                _loc_7 = LINEBREAK(_loc_7);
            }
            _loc_7 = BOUNDARY(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_6 = "Content-Disposition: form-data; name=\"Filedata\"; filename=\"";
            _loc_5 = 0;
            while (_loc_5 < _loc_6.length)
            {
                
                _loc_7.writeByte(_loc_6.charCodeAt(_loc_5));
                _loc_5++;
            }
            _loc_7.writeUTFBytes(param1);
            _loc_7 = QUOTATIONMARK(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_6 = "Content-Type: " + param3;
            _loc_5 = 0;
            while (_loc_5 < _loc_6.length)
            {
                
                _loc_7.writeByte(_loc_6.charCodeAt(_loc_5));
                _loc_5++;
            }
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7.writeBytes(param2, 0, param2.length);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7 = BOUNDARY(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_6 = "Content-Disposition: form-data; name=\"Upload\"";
            _loc_5 = 0;
            while (_loc_5 < _loc_6.length)
            {
                
                _loc_7.writeByte(_loc_6.charCodeAt(_loc_5));
                _loc_5++;
            }
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7 = LINEBREAK(_loc_7);
            _loc_6 = "Submit Query";
            _loc_5 = 0;
            while (_loc_5 < _loc_6.length)
            {
                
                _loc_7.writeByte(_loc_6.charCodeAt(_loc_5));
                _loc_5++;
            }
            _loc_7 = LINEBREAK(_loc_7);
            _loc_7 = BOUNDARY(_loc_7);
            _loc_7 = DOUBLEDASH(_loc_7);
            return _loc_7;
        }// end function

        private static function BOUNDARY(param1:ByteArray) : ByteArray
        {
            var _loc_2:* = UploadPostHelper.getBoundary().length;
            param1 = DOUBLEDASH(param1);
            var _loc_3:int = 0;
            while (_loc_3 < _loc_2)
            {
                
                param1.writeByte(_boundary.charCodeAt(_loc_3));
                _loc_3++;
            }
            return param1;
        }// end function

        private static function LINEBREAK(param1:ByteArray) : ByteArray
        {
            param1.writeShort(3338);
            return param1;
        }// end function

        private static function QUOTATIONMARK(param1:ByteArray) : ByteArray
        {
            param1.writeByte(34);
            return param1;
        }// end function

        private static function DOUBLEDASH(param1:ByteArray) : ByteArray
        {
            param1.writeShort(11565);
            return param1;
        }// end function

    }
}

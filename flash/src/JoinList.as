package 
{
    import de.polygonal.ds.*;
    import flash.display.*;
    import flash.events.*;
    import flash.geom.*;

    dynamic public class JoinList extends MovieClip
    {
        public var joins_table:Object;
        public var joins:Array;
        public var holes:Heap;
        public var click_handler:Function;

        public function JoinList()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function addJoin(param1:String, param2:String, param3:String, param4:String, param5:String, param6:String)
        {
            var _loc_7:JoinButton = null;
            var _loc_8:int = 0;
            if (this.holes.size() > 0)
            {
                _loc_8 = -this.holes.dequeue().id;
                _loc_7 = this.joins[_loc_8];
            }
            else
            {
                _loc_7 = new JoinButton();
                _loc_7.addEventListener(MouseEvent.CLICK, this.click_handler);
                _loc_7.x = 0;
                _loc_8 = this.joins.length;
                _loc_7.y = _loc_8 * _loc_7.height;
                this.joins.push(_loc_7);
            }
            this.joins_table[this.arrayToString([param1, param6])] = _loc_8;
            _loc_7.initialize(param1, param2, param3, param4, param5, param6);
            addChild(_loc_7);
            return;
        }// end function

        public function removeJoin(param1:String, param2:String)
        {
            var _loc_3:* = this.joins_table[this.arrayToString([param1, param2])];
            if (_loc_3 == undefined)
            {
                return;
            }
            var _loc_4:* = int(_loc_3);
            removeChild(this.joins[_loc_4]);
            this.holes.enqueue(new ComparableInt(-_loc_4));
            this.joins_table[param1] = undefined;
            return;
        }// end function

        public function clear()
        {
            var _loc_1:* = 0;
            while (_loc_1 < this.joins.length)
            {
                
                try
                {
                    removeChild(this.joins[_loc_1]);
                }
                catch (e)
                {
                }
                _loc_1 = _loc_1 + 1;
            }
            this.joins_table = new Object();
            this.joins = new Array();
            this.holes.free();
            this.holes = new Heap(false, -1);
            return;
        }// end function

        public function setClickHandler(param1:Function)
        {
            this.click_handler = param1;
            return;
        }// end function

        public function setEnabled(param1:Boolean)
        {
            var _loc_2:ColorTransform = null;
            if (param1)
            {
                _loc_2 = new ColorTransform();
                transform.colorTransform = _loc_2;
                mouseChildren = true;
            }
            else
            {
                _loc_2 = new ColorTransform(1, 1, 1, 0.4);
                transform.colorTransform = _loc_2;
                mouseChildren = false;
            }
            return;
        }// end function

        public function arrayToString(param1:Array) : String
        {
            var _loc_2:String = "";
            var _loc_3:* = 0;
            while (_loc_3 < param1.length)
            {
                
                if (_loc_3 != 0)
                {
                    _loc_2 = _loc_2 + ",";
                }
                _loc_2 = _loc_2 + this.replaceAll(this.replaceAll(param1[_loc_3], "\\", "\\\\"), ",", "\\,");
                _loc_3 = _loc_3 + 1;
            }
            return _loc_2;
        }// end function

        public function replaceAll(param1:String, param2:String, param3:String) : String
        {
            return param1.split(param2).join(param3);
        }// end function

        public function destroyE(event:Event)
        {
            this.holes.free();
            return;
        }// end function

        function frame1()
        {
            this.joins_table = new Object();
            this.joins = new Array();
            this.holes = new Heap(false, -1);
            addEventListener(Event.REMOVED_FROM_STAGE, this.destroyE);
            return;
        }// end function

    }
}

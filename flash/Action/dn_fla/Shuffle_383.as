package dn_fla
{
    import fl.transitions.*;
    import fl.transitions.easing.*;
    import flash.display.*;
    import flash.media.*;

    dynamic public class Shuffle_383 extends MovieClip
    {
        public var FLY_TIME:Number;
        public var TWEEN_TIME:Number;
        public var cards:Array;
        public var orig_parent:DisplayObjectContainer;
        public var oldvals1:Array;
        public var oldvals2:Array;
        public var num_out:int;
        public var start_out:int;

        public function Shuffle_383()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function addTweens(param1:Function, param2:DuelMap, param3:String, param4:Function)
        {
            this.param1(this.moveHere, param2);
            this.param1(this.moveOut);
            this.param1(this.moveDownAndUp);
            this.param1(this.moveIn);
            this.param1(this.moveOut);
            this.param1(this.moveDownAndUp);
            this.param1(this.moveIn);
            this.param1(this.moveOut);
            this.param1(this.moveDownAndUp);
            this.param1(this.moveIn);
            this.param1(this.moveBack1, null, false);
            this.param1(param4);
            this.param1(this.moveBack2, [param2, param3]);
            return;
        }// end function

        public function moveHere(param1:DuelMap) : Array
        {
            var _loc_6:Number = NaN;
            var _loc_7:Number = NaN;
            var _loc_8:Number = NaN;
            var _loc_9:DuelCard = null;
            this.cards = param1.toArray().reverse();
            var _loc_2:* = new Array(this.cards.length >> 3);
            this.oldvals1 = new Array(this.cards.length * 5);
            this.oldvals2 = new Array(_loc_2.length);
            var _loc_3:* = 0;
            var _loc_4:* = 0;
            if (parent.name == "shuffle1_mc")
            {
                _loc_6 = 180;
                _loc_7 = 0;
                _loc_8 = -180;
            }
            else
            {
                _loc_6 = -180;
                _loc_7 = 0;
                _loc_8 = -180;
            }
            var _loc_5:* = 0;
            while (_loc_5 < this.cards.length)
            {
                
                _loc_9 = this.cards[_loc_5];
                if (_loc_5 == 0)
                {
                    this.orig_parent = _loc_9.parent;
                }
                this.oldvals1[_loc_4] = _loc_9.x;
                _loc_4 = _loc_4 + 1;
                this.oldvals1[_loc_4] = _loc_9.y;
                _loc_4 = _loc_4 + 1;
                this.oldvals1[_loc_4] = _loc_9.z;
                _loc_4 = _loc_4 + 1;
                this.oldvals1[_loc_4] = _loc_9.cardRotationY;
                _loc_4 = _loc_4 + 1;
                this.oldvals1[_loc_4] = _loc_9.cardRotationZ;
                _loc_4 = _loc_4 + 1;
                _loc_9.scaleX = _loc_9.scale;
                _loc_9.rotationY = _loc_9.cardRotationY;
                _loc_9.rotationZ = _loc_9.cardRotationZ;
                _loc_9.transform.matrix3D = _loc_9.transform.getRelativeMatrix3D(this);
                addChild(_loc_9);
                this.oldvals2[_loc_3] = _loc_9.x;
                _loc_2[_loc_3] = new Tween(_loc_9, "x", Regular.easeInOut, _loc_9.x, 200, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.y;
                _loc_2[_loc_3] = new Tween(_loc_9, "y", Regular.easeInOut, _loc_9.y, 290, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.z;
                _loc_2[_loc_3] = new Tween(_loc_9, "z", Regular.easeInOut, _loc_9.z, -_loc_5, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.rotationX;
                _loc_2[_loc_3] = new Tween(_loc_9, "rotationX", Regular.easeInOut, _loc_9.rotationX, _loc_6, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.rotationY;
                _loc_2[_loc_3] = new Tween(_loc_9, "rotationY", Regular.easeInOut, _loc_9.rotationY, _loc_7, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.rotationZ;
                _loc_2[_loc_3] = new Tween(_loc_9, "rotationZ", Regular.easeInOut, _loc_9.rotationZ, _loc_8, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.scaleX;
                _loc_2[_loc_3] = new Tween(_loc_9, "scaleX", Regular.easeInOut, _loc_9.scaleX, 1, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                this.oldvals2[_loc_3] = _loc_9.scaleY;
                _loc_2[_loc_3] = new Tween(_loc_9, "scaleY", Regular.easeInOut, _loc_9.scaleY, 1, this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_5 = _loc_5 + 1;
            }
            return _loc_2;
        }// end function

        public function moveOut(param1) : Array
        {
            var _loc_5:DuelCard = null;
            if (this.cards.length == 1)
            {
                return [];
            }
            this.num_out = this.cards.length + 3 >> 2;
            this.start_out = this.cards.length - this.num_out - (this.cards.length >> 3);
            if (this.start_out > 0)
            {
                this.start_out = Math.floor(Math.random() * (this.start_out + 1));
            }
            var _loc_2:* = new Array(this.num_out);
            var _loc_3:* = 0;
            while (_loc_3 < _loc_2.length)
            {
                
                _loc_5 = this.cards[this.start_out + _loc_3];
                _loc_2[_loc_3] = new Tween(_loc_5, "y", Regular.easeInOut, _loc_5.y, 920, this.TWEEN_TIME, true);
                _loc_3 = _loc_3 + 1;
            }
            var _loc_4:* = new ShuffleSound();
            new ShuffleSound().play();
            return _loc_2;
        }// end function

        public function moveDownAndUp(param1) : Array
        {
            var _loc_5:int = 0;
            var _loc_6:DuelCard = null;
            var _loc_7:int = 0;
            if (this.cards.length == 1)
            {
                return [];
            }
            var _loc_2:* = new Array(this.cards.length - this.start_out);
            var _loc_3:* = -(this.cards.length - this.start_out - this.num_out);
            var _loc_4:* = 0;
            while (_loc_4 < _loc_2.length)
            {
                
                _loc_5 = this.start_out + _loc_4;
                _loc_6 = this.cards[_loc_5];
                if (_loc_4 < this.num_out)
                {
                    addChild(_loc_6);
                    _loc_7 = -_loc_5 + _loc_3;
                }
                else
                {
                    _loc_7 = -_loc_5 + this.num_out;
                }
                _loc_2[_loc_4] = new Tween(_loc_6, "z", Regular.easeInOut, _loc_6.z, _loc_7, this.TWEEN_TIME, true);
                _loc_4 = _loc_4 + 1;
            }
            return _loc_2;
        }// end function

        public function moveIn(param1) : Array
        {
            var _loc_5:DuelCard = null;
            if (this.cards.length == 1)
            {
                return [];
            }
            var _loc_2:* = new Array(this.num_out);
            var _loc_3:* = 0;
            while (_loc_3 < _loc_2.length)
            {
                
                _loc_5 = this.cards[this.start_out + _loc_3];
                _loc_2[_loc_3] = new Tween(_loc_5, "y", Regular.easeInOut, _loc_5.y, 290, this.TWEEN_TIME, true);
                _loc_3 = _loc_3 + 1;
            }
            var _loc_4:* = this.cards.splice(this.start_out, this.num_out);
            _loc_3 = 0;
            while (_loc_3 < _loc_4.length)
            {
                
                this.cards.push(_loc_4[_loc_3]);
                _loc_3 = _loc_3 + 1;
            }
            return _loc_2;
        }// end function

        public function moveBack1(param1) : Array
        {
            var _loc_5:DuelCard = null;
            var _loc_2:* = new Array(this.cards.length >> 3);
            var _loc_3:* = 0;
            var _loc_4:* = 0;
            while (_loc_4 < this.cards.length)
            {
                
                _loc_5 = this.cards[_loc_4];
                _loc_2[_loc_3] = new Tween(_loc_5, "x", Regular.easeInOut, _loc_5.x, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "y", Regular.easeInOut, _loc_5.y, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "z", Regular.easeInOut, _loc_5.z, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "rotationX", Regular.easeInOut, _loc_5.rotationX, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "rotationY", Regular.easeInOut, _loc_5.rotationY, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "rotationZ", Regular.easeInOut, _loc_5.rotationZ, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "scaleX", Regular.easeInOut, _loc_5.scaleX, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_2[_loc_3] = new Tween(_loc_5, "scaleY", Regular.easeInOut, _loc_5.scaleY, this.oldvals2[_loc_3], this.FLY_TIME, true);
                _loc_3 = _loc_3 + 1;
                _loc_4 = _loc_4 + 1;
            }
            this.oldvals2 = null;
            return _loc_2;
        }// end function

        public function moveBack2(param1:Array) : Array
        {
            var _loc_6:DuelCard = null;
            var _loc_2:* = 0;
            var _loc_3:* = 0;
            while (_loc_3 < this.cards.length)
            {
                
                _loc_6 = this.cards[_loc_3];
                this.orig_parent.addChild(_loc_6);
                _loc_6.x = this.oldvals1[_loc_2];
                _loc_2 = _loc_2 + 1;
                _loc_6.y = this.oldvals1[_loc_2];
                _loc_2 = _loc_2 + 1;
                _loc_6.z = this.oldvals1[_loc_2];
                _loc_2 = _loc_2 + 1;
                _loc_6.cardRotationY = this.oldvals1[_loc_2];
                _loc_2 = _loc_2 + 1;
                _loc_6.cardRotationZ = this.oldvals1[_loc_2];
                _loc_2 = _loc_2 + 1;
                _loc_6.scaleX = -_loc_6.scale;
                _loc_6.scaleY = _loc_6.scale;
                _loc_3 = _loc_3 + 1;
            }
            this.orig_parent = null;
            this.oldvals1 = null;
            var _loc_4:* = param1[0];
            var _loc_5:* = param1[1];
            _loc_4.remap(this.cards.reverse(), _loc_5);
            this.cards = null;
            return [];
        }// end function

        function frame1()
        {
            this.FLY_TIME = 0.5;
            this.TWEEN_TIME = 0.05;
            return;
        }// end function

    }
}

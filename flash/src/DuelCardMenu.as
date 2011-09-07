package 
{
    import fl.data.*;
    import fl.transitions.*;
    import fl.transitions.easing.*;
    import flash.display.*;
    import flash.events.*;
    import flash.geom.*;

    dynamic public class DuelCardMenu extends MovieClip
    {
        public var hidden_mc:MovieClip;
        public var mask_mc:MovieClip;
        public var click_callback:Function;
        public var card:DuelCard;
        public var tween:Tween;
        public var menu_width:Number;

        public function DuelCardMenu()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function initialize(param1:DataProvider, param2:Function, param3:DuelCard)
        {
            var _loc_9:Object = null;
            var _loc_10:DuelCardMenuItem = null;
            this.click_callback = param2;
            this.card = param3;
            var _loc_4:* = param3.scaleX;
            if (param3.scaleX < 0)
            {
                _loc_4 = -_loc_4;
            }
            var _loc_5:* = param3.parent.localToGlobal(new Point(param3.x, param3.y));
            if (param3.width < param3.height)
            {
                this.menu_width = _loc_4 * 400;
                x = _loc_5.x - _loc_4 * 200;
                y = _loc_5.y - _loc_4 * 290;
            }
            else
            {
                this.menu_width = _loc_4 * 580;
                x = _loc_5.x - _loc_4 * 290;
                y = _loc_5.y - _loc_4 * 200;
            }
            var _loc_6:Number = 0;
            var _loc_7:* = param1.length;
            var _loc_8:* = 0;
            while (_loc_8 < _loc_7)
            {
                
                _loc_9 = param1.getItemAt(_loc_8);
                _loc_10 = new DuelCardMenuItem();
                _loc_6 = _loc_6 - _loc_10.initialize(_loc_9.label, _loc_9.data, this.menu_width, _loc_8 == 0);
                _loc_10.y = _loc_6;
                _loc_10.addEventListener(MouseEvent.CLICK, this.itemClickE);
                this.hidden_mc.addChild(_loc_10);
                _loc_8 = _loc_8 + 1;
            }
            this.mask_mc.x = -10;
            this.mask_mc.width = this.menu_width + 20;
            this.mask_mc.height = -_loc_6 + 50;
            this.tween = new Tween(this.hidden_mc, "y", Regular.easeOut, -_loc_6, 0, -0.004 * _loc_6, true);
            return;
        }// end function

        public function itemClickE(event:MouseEvent)
        {
            this.click_callback(this.card, event.currentTarget.data, event);
            return;
        }// end function

        public function stopTween()
        {
            this.tween.stop();
            this.tween = null;
            return;
        }// end function

        function frame1()
        {
            return;
        }// end function

    }
}

package dn_fla
{
    import flash.display.*;
    import flash.events.*;

    dynamic public class TatFebruaryLeaderboard_430 extends MovieClip
    {
        public var new_window_mc:MovieClip;
        public var init:Boolean;

        public function TatFebruaryLeaderboard_430()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function mouseOverE(event:MouseEvent)
        {
            this.new_window_mc.visible = true;
            return;
        }// end function

        public function mouseOutE(event:MouseEvent)
        {
            this.new_window_mc.visible = false;
            return;
        }// end function

        function frame1()
        {
            if (!this.init)
            {
                this.init = true;
                this.new_window_mc.visible = false;
                buttonMode = true;
                tabEnabled = false;
                addEventListener(MouseEvent.ROLL_OVER, this.mouseOverE);
                addEventListener(MouseEvent.ROLL_OUT, this.mouseOutE);
            }
            return;
        }// end function

    }
}

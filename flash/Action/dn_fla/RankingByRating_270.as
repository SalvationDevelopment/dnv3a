﻿package dn_fla
{
    import flash.display.*;

    dynamic public class RankingByRating_270 extends MovieClip
    {
        public var button_btn:SimpleButton;
        public var activated_mc:MovieClip;

        public function RankingByRating_270()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function setActivated(param1:Boolean)
        {
            this.activated_mc.visible = param1;
            this.button_btn.visible = !param1;
            return;
        }// end function

        function frame1()
        {
            this.activated_mc.visible = false;
            return;
        }// end function

    }
}
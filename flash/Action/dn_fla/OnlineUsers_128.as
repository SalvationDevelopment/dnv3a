package dn_fla
{
    import fl.controls.*;
    import flash.display.*;
    import flash.events.*;

    dynamic public class OnlineUsers_128 extends MovieClip
    {
        public var users_mc:List;
        public var users_online_txt:Label;
        public var top_mc:MovieClip;
        public var minimize_btn:SimpleButton;
        public var remember_position:Boolean;

        public function OnlineUsers_128()
        {
            addFrameScript(0, this.frame1);
            this.__setProp_users_online_txt_OnlineUsers_count_0();
            return;
        }// end function

        public function startDragE(event:MouseEvent)
        {
            this.remember_position = true;
            startDrag();
            return;
        }// end function

        public function dropE(event:MouseEvent)
        {
            stopDrag();
            return;
        }// end function

        function __setProp_users_online_txt_OnlineUsers_count_0()
        {
            try
            {
                this.users_online_txt["componentInspectorSetting"] = true;
            }
            catch (e:Error)
            {
            }
            this.users_online_txt.autoSize = "none";
            this.users_online_txt.condenseWhite = false;
            this.users_online_txt.enabled = true;
            this.users_online_txt.htmlText = "";
            this.users_online_txt.selectable = false;
            this.users_online_txt.text = "Users online: 0";
            this.users_online_txt.visible = true;
            this.users_online_txt.wordWrap = false;
            try
            {
                this.users_online_txt["componentInspectorSetting"] = false;
            }
            catch (e:Error)
            {
            }
            return;
        }// end function

        function frame1()
        {
            visible = false;
            this.remember_position = false;
            this.top_mc.addEventListener(MouseEvent.MOUSE_DOWN, this.startDragE);
            this.top_mc.addEventListener(MouseEvent.MOUSE_UP, this.dropE);
            return;
        }// end function

    }
}

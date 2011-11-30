package dn_fla
{
    import fl.controls.*;
    import fl.data.*;
    import flash.display.*;
    import flash.events.*;

    dynamic public class PrivateChat_125 extends MovieClip
    {
        public var exit_btn:SimpleButton;
        public var user_mc:ComboBox;
        public var top_mc:MovieClip;
        public var minimize_btn:SimpleButton;
        public var cout_txt:TextArea;
        public var cin_txt:TextInput;
        public var scroll_pos:int;
        public var remember_position:Boolean;

        public function PrivateChat_125()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function setChat(param1:TextArea, param2:TextInput)
        {
            if (this.cout_txt != null)
            {
                this.cout_txt.removeEventListener(Event.ENTER_FRAME, this.saveScrollPosE);
                this.cout_txt.removeEventListener(FocusEvent.FOCUS_OUT, this.restoreScrollPosE);
                removeChild(this.cout_txt);
                removeChild(this.cin_txt);
            }
            this.cout_txt = param1;
            this.cin_txt = param2;
            this.cout_txt.addEventListener(Event.ENTER_FRAME, this.saveScrollPosE);
            this.cout_txt.addEventListener(FocusEvent.FOCUS_OUT, this.restoreScrollPosE);
            addChild(this.cout_txt);
            addChild(this.cin_txt);
            return;
        }// end function

        public function saveScrollPosE(event:Event)
        {
            this.scroll_pos = this.cout_txt.verticalScrollPosition;
            return;
        }// end function

        public function restoreScrollPosE(event:FocusEvent)
        {
            if (this.scroll_pos >= 0)
            {
                this.cout_txt.verticalScrollPosition = this.scroll_pos;
            }
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

        function frame1()
        {
            visible = false;
            this.user_mc.dataProvider = new DataProvider([]);
            this.scroll_pos = -1;
            this.remember_position = false;
            this.top_mc.addEventListener(MouseEvent.MOUSE_DOWN, this.startDragE);
            this.top_mc.addEventListener(MouseEvent.MOUSE_UP, this.dropE);
            return;
        }// end function

    }
}

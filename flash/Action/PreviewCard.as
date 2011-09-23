package 
{
    import fl.controls.*;
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;

    dynamic public class PreviewCard extends MovieClip
    {
        public var preview_desc_txt:TextArea;
        public var front2_mc:Front;
        public var front1_mc:Front;
        public var fronts:Array;
        public var preview_timer:Timer;

        public function PreviewCard()
        {
            addFrameScript(0, this.frame1);
            this.__setProp_preview_desc_txt_PreviewCard_Layer1_0();
            return;
        }// end function

        public function previewE(event:MouseEvent, param2 = null)
        {
            var _loc_3:* = event == null ? (Front(param2.front_mc)) : (Front(event.currentTarget.front_mc));
            if (this.fronts[0].id == _loc_3.id)
            {
                return;
            }
            this.fronts[1].copyFront(_loc_3);
            this.preview_timer.reset();
            this.preview_timer.start();
            return;
        }// end function

        public function previewStopE(event:MouseEvent)
        {
            this.preview_timer.reset();
            return;
        }// end function

        public function previewFinishE(event:TimerEvent)
        {
            this.fronts[0].visible = false;
            this.fronts[1].visible = true;
            var _loc_2:* = this.fronts[0];
            this.fronts[0] = this.fronts[1];
            this.fronts[1] = _loc_2;
            this.preview_desc_txt.text = this.fronts[0].desc;
            this.preview_desc_txt.visible = true;
            return;
        }// end function

        function __setProp_preview_desc_txt_PreviewCard_Layer1_0()
        {
            try
            {
                this.preview_desc_txt["componentInspectorSetting"] = true;
            }
            catch (e:Error)
            {
            }
            this.preview_desc_txt.condenseWhite = false;
            this.preview_desc_txt.editable = false;
            this.preview_desc_txt.enabled = true;
            this.preview_desc_txt.horizontalScrollPolicy = "auto";
            this.preview_desc_txt.htmlText = "";
            this.preview_desc_txt.maxChars = 0;
            this.preview_desc_txt.restrict = "";
            this.preview_desc_txt.text = "";
            this.preview_desc_txt.verticalScrollPolicy = "auto";
            this.preview_desc_txt.visible = false;
            this.preview_desc_txt.wordWrap = true;
            try
            {
                this.preview_desc_txt["componentInspectorSetting"] = false;
            }
            catch (e:Error)
            {
            }
            return;
        }// end function

        function frame1()
        {
            this.fronts = [this.front1_mc, this.front2_mc];
            this.front1_mc.visible = false;
            this.front2_mc.visible = false;
            this.preview_timer = new Timer(250, 1);
            this.preview_timer.addEventListener(TimerEvent.TIMER, this.previewFinishE);
            return;
        }// end function

    }
}

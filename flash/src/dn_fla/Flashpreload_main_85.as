package dn_fla
{
    import flash.display.*;
    import flash.events.*;
    import flash.net.*;
    import flash.system.*;
    import flash.text.*;
    import flash.utils.*;

    dynamic public class Flashpreload_main_85 extends MovieClip
    {
        public var borderAnim:MovieClip;
        public var adToolTip:MovieClip;
        public var btn_powered:MovieClip;
        public var content_mc:MovieClip;
        public var preloaderColor:int;
        public var preloadtxtColor:int;
        public var c1:Number;
        public var c2:Number;
        public var c3:Number;
        public var c4:Number;
        public var GameID:Object;
        public var parentObj:Object;
        public var myFormat:TextFormat;
        public var clicktag:String;
        public var loadclip:String;
        public var requestStr:String;
        public var urlrequest:URLRequest;
        public var url_loader:URLLoader;

        public function Flashpreload_main_85()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function openSite(event:MouseEvent) : void
        {
            var _loc_2:* = new URLRequest("http://www.ad4game.com");
            navigateToURL(_loc_2, "_blank");
            return;
        }// end function

        public function loadClip(param1:String)
        {
            var _loc_2:* = new URLRequest(param1);
            var _loc_3:* = new Loader();
            _loc_3.contentLoaderInfo.addEventListener(Event.COMPLETE, this.loadComplete);
            _loc_3.load(_loc_2);
            this.content_mc.holder.addChild(_loc_3);
            return;
        }// end function

        public function startScene(event:MouseEvent) : void
        {
            this.parentObj.gotoAndPlay(1, "Starting Screen");
            return;
        }// end function

        public function loadComplete(event:Event) : void
        {
            var _loc_2:* = new Timer(3000);
            _loc_2.addEventListener("timer", this.borderanimation);
            _loc_2.start();
            this.content_mc.useHandCursor = true;
            this.content_mc.buttonMode = true;
            this.content_mc.btn.addEventListener(MouseEvent.MOUSE_OVER, this.showTooltip);
            this.content_mc.btn.addEventListener(MouseEvent.MOUSE_OUT, this.hideTooltip);
            this.content_mc.btn.addEventListener(MouseEvent.CLICK, this.openUrl);
            this.content_mc.mcLoader1.visible = false;
            this.content_mc.bg_mc.visible = true;
            this.btn_powered.visible = true;
            return;
        }// end function

        public function pauseDispaly_screen(event:MouseEvent)
        {
            this.content_mc.visible = false;
            this.borderAnim.visible = false;
            this.btn_powered.visible = false;
            return;
        }// end function

        public function pauseframe(event:MouseEvent)
        {
            event.currentTarget.gotoAndStop(1);
            return;
        }// end function

        public function playframe(event:MouseEvent)
        {
            event.currentTarget.gotoAndStop(2);
            return;
        }// end function

        public function borderanimation(event:TimerEvent) : void
        {
            this.borderAnim.gotoAndPlay(2);
            return;
        }// end function

        public function showTooltip(event:MouseEvent) : void
        {
            this.adToolTip.visible = true;
            return;
        }// end function

        public function hideTooltip(event:MouseEvent) : void
        {
            this.adToolTip.visible = false;
            return;
        }// end function

        public function loadData(event:Event) : void
        {
            this.display(this.url_loader.data);
            return;
        }// end function

        public function openUrl(event:MouseEvent) : void
        {
            var _loc_2:* = new URLRequest(this.clicktag);
            navigateToURL(_loc_2, "_blank");
            return;
        }// end function

        public function display(param1)
        {
            var _loc_2:* = undefined;
            _loc_2 = param1.indexOf(".swf", 0);
            var _loc_3:* = param1.indexOf(".gif", 0);
            if (_loc_2 == -1 && _loc_3 != -1)
            {
                this.c1 = param1.indexOf("http", 0);
                this.c2 = param1.indexOf("target", 0);
                this.clicktag = param1.substr(this.c1, this.c2 - 11);
                this.c3 = param1.indexOf("http", this.c2);
                this.c4 = param1.indexOf("gif", this.c2);
                this.loadclip = param1.substr(this.c3, this.c4 - this.c3 + 3);
            }
            else if (_loc_2 == -1 && _loc_3 == -1)
            {
                this.c1 = param1.indexOf("http", 0);
                this.c2 = param1.indexOf("target", 0);
                this.clicktag = param1.substr(this.c1, this.c2 - 11);
                this.c3 = param1.indexOf("http", this.c2);
                this.c4 = param1.indexOf("jpg", this.c2);
                this.loadclip = param1.substr(this.c3, this.c4 - this.c3 + 3);
            }
            else
            {
                this.c1 = param1.indexOf("FILE1", 0);
                this.c2 = param1.indexOf(".swf", this.c1);
                this.loadclip = param1.substr(this.c1 + 6, this.c2 - this.c1 - 2);
                this.c3 = param1.indexOf("clickTAG", 0);
                this.c4 = param1.indexOf("\"", this.c3);
                this.clicktag = param1.substr(this.c3 + 9, this.c4 - this.c3 - 10);
            }
            this.loadClip(this.loadclip);
            return;
        }// end function

        function frame1()
        {
            stop();
            Security.allowDomain("http://ads.ad4game.com/");
            this.preloaderColor = 10027008;
            this.preloadtxtColor = 16777215;
            this.GameID = 19222;
            this.parentObj = this.parent;
            this.myFormat = new TextFormat();
            this.myFormat.color = this.preloadtxtColor;
            this.requestStr = "http://ads.ad4game.com/www/delivery/afr.php?zoneid=" + this.GameID;
            this.urlrequest = new URLRequest(this.requestStr);
            this.url_loader = new URLLoader();
            this.url_loader.load(this.urlrequest);
            this.url_loader.addEventListener(Event.COMPLETE, this.loadData);
            this.adToolTip.visible = false;
            this.adToolTip.mouseChildren = false;
            this.adToolTip.mouseEnabled = false;
            this.btn_powered.visible = false;
            this.btn_powered.useHandCursor = true;
            this.btn_powered.buttonMode = true;
            this.btn_powered.addEventListener(MouseEvent.MOUSE_DOWN, this.openSite);
            return;
        }// end function

    }
}

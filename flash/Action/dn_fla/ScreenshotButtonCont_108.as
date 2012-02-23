package dn_fla
{
    import com.adobe.images.*;
    import flash.display.*;
    import flash.events.*;
    import flash.geom.*;
    import flash.media.*;
    import flash.net.*;
    import flash.utils.*;

    dynamic public class ScreenshotButtonCont_108 extends MovieClip
    {
        public var screenshot_btn:SimpleButton;
        public var camera_glow_mc:MovieClip;
        public var camera_flash_mc:MovieClip;
        public var screenshot_loader:URLLoader;

        public function ScreenshotButtonCont_108()
        {
            addFrameScript(0, this.frame1);
            return;
        }// end function

        public function screenshotE(event:MouseEvent)
        {
            this.screenshot_btn.visible = false;
            this.camera_flash_mc.visible = true;
            this.camera_glow_mc.visible = true;
            var _loc_2:* = new BitmapData(stage.stageWidth, stage.stageHeight);
            _loc_2.draw(stage, null, null, null, new Rectangle(0, 0, stage.stageWidth, stage.stageHeight));
            var _loc_3:* = new JPGEncoder(85).encode(_loc_2);
            var _loc_4:* = new URLRequest("http://imgur.com/upload");
            new URLRequest("http://imgur.com/upload").contentType = "multipart/form-data; boundary=" + UploadPostHelper.getBoundary();
            _loc_4.method = URLRequestMethod.POST;
            _loc_4.data = UploadPostHelper.getPostData("file", _loc_3, "image/jpeg", null);
            this.screenshot_loader = new URLLoader();
            this.screenshot_loader.dataFormat = URLLoaderDataFormat.BINARY;
            this.screenshot_loader.addEventListener(Event.COMPLETE, this.screenshotComplete);
            this.screenshot_loader.addEventListener(IOErrorEvent.IO_ERROR, this.screenshotError);
            this.screenshot_loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.screenshotError);
            this.screenshot_loader.load(_loc_4);
            var _loc_5:* = new CameraSound();
            new CameraSound().play();
            return;
        }// end function

        public function screenshotComplete(event:Event)
        {
            this.screenshot_btn.visible = true;
            this.camera_flash_mc.visible = false;
            this.camera_glow_mc.visible = false;
            var _loc_2:* = this.screenshot_loader.data;
            var _loc_3:* = _loc_2.indexOf("\"hashes\":\"[\\\"");
            if (_loc_3 < 0)
            {
                this.screenshotError();
                return;
            }
            _loc_3 = _loc_3 + 13;
            var _loc_4:* = _loc_2.indexOf("\\\"", _loc_3);
            if (_loc_3 < 0)
            {
                this.screenshotError();
                return;
            }
            var _loc_5:* = _loc_2.substring(_loc_3, _loc_4);
            navigateToURL(new URLRequest("http://imgur.com/" + _loc_5), "_blank");
            return;
        }// end function

        public function screenshotError(event:IOErrorEvent = null)
        {
            this.screenshot_btn.visible = true;
            this.camera_flash_mc.visible = false;
            this.camera_glow_mc.visible = false;
            return;
        }// end function

        function frame1()
        {
            this.screenshot_btn.tabEnabled = false;
            this.screenshot_btn.addEventListener(MouseEvent.CLICK, this.screenshotE);
            this.camera_glow_mc.visible = false;
            return;
        }// end function

    }
}

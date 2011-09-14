
;(function() {
"use strict";

function LoadingView() {}
LoadingView.prototype = new View();
LoadingView.prototype.id = 'loadingview';
window.LoadingView = LoadingView;

})();

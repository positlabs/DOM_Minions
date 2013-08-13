dom = dom || {};
dom.Mouse = new (function () {

	this.CLICK = "click";

	if (window.navigator.msPointerEnabled) {
		this.DOWN = "MSPointerDown";
		this.UP = "MSPointerUp";
		this.MOVE = "MSPointerMove";
		this.OVER = "MSPointerOver";
		this.OUT = "MSPointerOut";
		this.CANCEL = "MSPointerCancel";

	} else if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		this.DOWN = "touchstart";
		this.UP = "touchend";
		this.MOVE = "touchmove";
		this.OVER = "mouseover"; // no equivalent
		this.OUT = "touchleave";
		this.CANCEL = "touchcancel";

	} else {
		this.DOWN = "mousedown";
		this.UP = "mouseup";
		this.MOVE = "mousemove";
		this.OVER = "mouseover";
		this.OUT = "mouseout";
		this.CANCEL = "mousecancel"; // non-existent
	}

})();
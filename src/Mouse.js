define(function () {

	var Mouse = {};
	Mouse.CLICK = "click";

	if (window.navigator.msPointerEnabled) {
		Mouse.DOWN = "MSPointerDown";
		Mouse.UP = "MSPointerUp";
		Mouse.MOVE = "MSPointerMove";
		Mouse.OVER = "MSPointerOver";
		Mouse.OUT = "MSPointerOut";
		Mouse.CANCEL = "MSPointerCancel";

	} else if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		Mouse.DOWN = "touchstart";
		Mouse.UP = "touchend";
		Mouse.MOVE = "touchmove";
		Mouse.OVER = "mouseover"; // no equivalent
		Mouse.OUT = "touchleave";
		Mouse.CANCEL = "touchcancel";

	} else {
		Mouse.DOWN = "mousedown";
		Mouse.UP = "mouseup";
		Mouse.MOVE = "mousemove";
		Mouse.OVER = "mouseover";
		Mouse.OUT = "mouseout";
		Mouse.CANCEL = "mousecancel"; // non-existent
	}

	return Mouse;

});
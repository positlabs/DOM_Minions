/**
 *
 *   Trains existing Nodes / NodeLists to become DOM minions
 *   (extends Node / NodeList prototypes with dom.* methods)
 *
 */

(function () {

	var _Node = Node.prototype;
	var _NodeList = NodeList.prototype;

	_Node.add = _NodeList.add = function (node, attributes) {
		return dom.add(node, this, attributes);
	};

	/**
	 *  @arg node: node to remove. if unspecified, remove this node
	 */
	_Node.rm = _NodeList.rm = function (node) {
		if (node) {
			return dom.rm(node, this);
		} else {
			return dom.rm(this);
		}
	};

	_Node.insert = function (node, index) {
		return dom.insert(node, index, this);
	};

	_Node.clone = _NodeList.clone = function (deep) {
		return dom.clone(this, deep);
	};

	/**
	 *  query a selector on this node
	 */
	_Node.find = function (selectorString) {
		return dom(selectorString, this);
	};

	/**
	 *  convenience methods for adding event listeners to Elements
	 *  supports space-delimited event lists
	 *  @example: node.on("click touchstart", func)
	 */
	_Node.on = function (eventName, callback) {
		var events = eventName.split(" ");
		var i = events.length;
		while (i--) {
			this.addEventListener(events[i], callback);
		}
	};
	_NodeList.on = function (eventName, callback) {
		var i = this.length;
		while (i--) {
			this[i].on(eventName, callback);
		}
	};

	/**
	 *  tap listener gets fired only if move event isn't detected within 100ms
	 *  @arg waitMills (optional): time allowed to detect move event that will cancel touchstart. default 300ms
	 */
	_Node.tap = function (callback, waitMillis) {
		waitMillis = waitMillis || 300;
		var timer;
		this.addEventListener(Mouse.DOWN, function (e) {
			var target = this;
			timer = setTimeout(function () {
				e.tapTarget = target;
				callback(e)
			}, waitMillis);
		});
		this.addEventListener(Mouse.MOVE, function () {
			clearTimeout(timer);
		});

	};

	_NodeList.tap = function (callback) {
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			this[i].tap(callback);
		}
	};

	/**
	 *  listens to an event once
	 */
	_Node.once = _NodeList.one = function (eventName, callback) {
		var me = this;
		this.on(eventName, onEvt);
		function onEvt() {
			me.off(eventName, onEvt);
			callback()
		}
	};

	/**
	 *  remove an event listener
	 */
	_Node.off = function (eventName, callback) {
		var events = eventName.split(" ");
		var i = events.length;
		while (i--) {
			this.removeEventListener(events[i], callback);
		}
	};

	/**
	 *  remove an event listener
	 */
	_NodeList.off = function (eventName, callback) {
		var i = this.length;
		while (i--) {
			this[i].off(eventName, callback);
		}
	};

	/**
	 *   modify node style with a style object
	 *   {left:0, top:"200px"}
	 */
	_Node.css = function (styleObject) {
		for (var s in styleObject) {
			this.style[s] = styleObject[s];
		}
	};

	_NodeList.css = function (styleObject) {
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			for (var s in styleObject) {
				this[i].style[s] = styleObject[s];
			}
		}
	};

	/**
	 *  check if a node exists in a nodelist
	 */
	_NodeList.contains = function (node) {
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			if (node == this[i]) return true;
		}
		return false;
	};

})();

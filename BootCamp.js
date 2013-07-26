/**
 *
 *   Trains existing Nodes / NodeLists to become DOM minions
 *   (extends Node / NodeList prototypes with dom.* methods)
 *
 */

(function () {

	var nodeProto = Node.prototype;
	var nodeListProto = NodeList.prototype;

	nodeProto.add = nodeListProto.add = function (node, attributes) {
		return dom.add(node, this, attributes);
	};

	/**
	 *  @arg node: node to remove. if unspecified, remove this node
	 */
	nodeProto.rm = nodeListProto.rm = function (node) {
		if (node) {
			return dom.rm(node, this);
		} else {
			return dom.rm(this);
		}
	};

	nodeProto.insert = function (node, index) {
		return dom.insert(node, index, this);
	};

	nodeProto.clone = nodeListProto.clone = function (deep) {
		return dom.clone(this, deep);
	};

	nodeProto.find = function (selectorString) {
		return dom(selectorString, this);
	};

	/**
	 *  convenience methods for adding event listeners to Elements
	 *  supports space-delimited event lists
	 *  @example: node.on("click touchstart", func)
	 */
	nodeProto.on = function (eventName, callback) {
		var events = eventName.split(" ");
		var i = events.length;
		while (i--) {
			this.addEventListener(events[i], callback);
		}
	};
	nodeListProto.on = function (eventName, callback) {
		var i = this.length;
		while (i--) {
			this[i].on(eventName, callback);
		}
	};

	/**
	 *  tap listener gets fired only if move event isn't detected within 100ms
	 *  @arg waitMills (optional): time allowed to detect move event that will cancel touchstart. default 100ms
	 */
	nodeProto.tap = function (callback, waitMillis) {
		waitMillis = waitMillis || 100;
		var timer;

		this.addEventListener(Mouse.DOWN, function (e) {
			timer = setTimeout(function () {
				callback(e)
			}, waitMillis);
		});

		this.addEventListener(Mouse.MOVE, function () {
			clearTimeout(timer);
		});

	};

	nodeListProto.tap = function (callback) {
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			this[i].tap(callback);
		}
	};

	/**
	 *  listens to an event once
	 */
	nodeProto.once = nodeListProto.once = function (eventName, callback) {
		var me = this;
		this.on(eventName, function () {
			me.off(eventName);
			callback();
		});
	};

	/**
	 *  remove an event listener
	 */
	nodeProto.off = function (eventName, callback) {
		var events = eventName.split(" ");
		var i = events.length;
		while (i--) {
			this.removeEventListener(events[i], callback);
		}
	};

	/**
	 *  remove an event listener
	 */
	nodeListProto.off = function (eventName, callback) {
		var i = this.length;
		while (i--) {
			this[i].off(eventName, callback);
		}
	};

	/**
	*   modify node style with a style object
	*/
	nodeProto.css = function(styleObject){
		for(var s in styleObject){
			this.style[s] = styleObject[s];
		}
	};

	nodeListProto.css = function(styleObject){
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			for(var s in styleObject){
				this[i].style[s] = styleObject[s];
			}
		}
	};

})();

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
	 *  query a selector on this node, or find a child
	 */
	_Node.find = function (node) {
		dom.find(node, this);
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
	_NodeList.find = function (node) {
		for (var i = 0, maxi = this.length; i < maxi; i++) {
			if (node == this[i]) return true;
		}
		return false;
	};

})();

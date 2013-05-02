/**
 *
 *   Trains existing Nodes / NodeLists to become DOM minions
 *   (extends Node / NodeList prototypes with dom.* methods)
 *
 */

(function () {

	var nodeProto = Node.prototype;
	var nodeListProto = NodeList.prototype;

	nodeProto.add = nodeListProto.add = function (node) {
		return dom.add(node, this);
	};

	/**
	 *  @arg node: node to remove. if unspecified, remove this node
	 */
	nodeProto.remove = nodeListProto.remove = function (node) {
		if (node) {
			return dom.remove(node, this);
		} else {
			return dom.remove(this);
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
	 *  listens to an event once
	 */
	nodeProto.one = nodeListProto.one = function (eventName, callback) {
		var me = this;
		this.on(eventName, function () {
			me.off(eventName);
			callback();
		});
	};

	nodeProto.off = function (eventName, callback) {
		var events = eventName.split(" ");
		var i = events.length;
		while (i--) {
			this.removeEventListener(events[i], callback);
		}
	};

	nodeListProto.off = function (eventName, callback) {
		var i = this.length;
		while (i--) {
			this[i].off(eventName, callback);
		}
	};

	nodeProto.mouseEnabled = function (v) {
		this.style['pointer-events'] = (v) ? 'auto' : 'none';
	};

	/**
	 *  checks opacity, display, visibility to determine if Node is visible
	 *  @return boolean: is the view visible?
	 */
	nodeProto.isVisible = function () {
		var hidden = (this.style.opacity === 0 || this.style.display == "none" || this.style.visibility == "hidden" || !document.body.contains(this));
		return !hidden;
	};

})();

/**
 *
 *   Trains existing Nodes / NodeLists to become DOM minions
 *   (extends Node / NodeList prototypes with dom.* methods)
 *
 */

(function () {

	// hack for undefined Node in IE8
	if (typeof Node == "undefined") {
		Node = Element;
	}

	var listen, unlisten;
	if (typeof window.attachEvent != "undefined") {
		listen = function (el, evt, callback) {
			el.attachEvent("on" + evt, callback);
		};
		unlisten = function (el, evt, callback) {
			el.detachEvent("on" + evt, callback);
		};
	} else {
		listen = function (el, evt, callback) {
			el.addEventListener(evt, callback);
		};
		unlisten = function (el, evt, callback) {
			el.removeEventListener(evt, callback);
		};
	}

	var _Node = {};//Node.prototype;
	var _NodeList = {};//NodeList.prototype;

	_Node.add = _NodeList.add = function (node, attributes) {
		return dom.add(node, this, attributes);
	};

	/**
	 *  @arg node: node to remove. if unspecified, remove this node
	 */
	_Node.remove = _NodeList.remove = function (node) {
		if (node) {
			return dom.remove(node, this);
		} else {
			return dom.remove(this);
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
		return dom.find(node, this);
	};

	/**
	 *  convenience methods for adding event listeners to Elements
	 *  supports space-delimited event lists
	 *  @example: node.on("click touchstart", func)
	 *
	 *  @arg eventNames: space delimited list, or array of events
	 */
	_Node.on = window.on = function (eventNames, callback) {
		var events;
		if(typeof events == "string") events = eventNames.split(" ");
		else if(eventNames instanceof Array)events = eventNames;

		var i = events.length;
		while (i--) {
			listen(this, events[i], callback);
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
	_Node.once = window.once = _NodeList.once = function (eventName, callback) {
		var me = this;
		this.on(eventName, onEvt);
		function onEvt(e) {
			me.off(eventName, onEvt);
			callback(e);
		}
	};

	/**
	 *  remove an event listener
	 */
	_Node.off = window.off = function (eventName, callback) {
		var events;
		if(typeof events == "string") events = eventNames.split(" ");
		else if(eventNames instanceof Array)events = eventNames;

		var i = events.length;
		while (i--) {
			unlisten(this, events[i], callback);
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

	_Node.each = function(func){
		func(this);
	};

	_NodeList.each = function(func){
		for (var i = 0, maxi = this.length; i < maxi; i++) {
		  func(this[i]);
		}
	};

	function merge(hostObj, newObj) {
		for (var f in newObj) {
			hostObj[f] = newObj[f];
		}
	}

	merge(Node.prototype, _Node);
	merge(Element.prototype, _Node);
	merge(NodeList.prototype, _NodeList);

	if (typeof StaticNodeList != "undefined") {
		merge(StaticNodeList.prototype, _NodeList);
	}

})();

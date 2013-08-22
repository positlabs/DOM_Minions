// Original file: dom.js
/**
 *
 *  Makes minions from ordinary DOM elements. Good for conquering the internet.
 *
 *  @see: Node object documentation - http://www.w3schools.com/jsref/dom_obj_node.asp
 *
 */
var dom;
(function () {

	/**
	 *  @arg selector: selector string
	 *  @arg context: optional context to search in. defaults to document.body
	 *  @return: Node or NodeList
	 */
	dom = function (selector, context) {
		var rtn = dom._(selector, context);
		if (typeof rtn == "undefined")console.warn(selector, "not found in document");
		return rtn;
	};

	// privately used, doesn't throw a warning when node isn't found
	dom._ = function (selector, optInNode) {
		var inNode;
		if (typeof optInNode == "string") {
			inNode = document.querySelectorAll(optInNode);
		} else {
			inNode = optInNode || document;
		}
		var result = inNode.querySelectorAll(selector),
			rtn;
		result.length > 1 ? rtn = result : rtn = result[0];
		return rtn;
	};


	/**
	 *  makes a new Element
	 *  @arg tagName: type of element to create
	 *  @arg content: contents of the new tag, can be of type string or Node
	 *  @arg attributes: json-format of attributes to add to the tag
	 *  @return: the newly created element
	 */
	dom.tag = function (tagName, content, attributes) {
		var el = document.createElement(tagName);
		if (content) {

			if (typeof content == "string") {
				el.innerHTML = content;
			} else {
				el.appendChild(content);
			}
		}

		if (attributes) {
			for (var a in attributes) {
				el.setAttribute(a, attributes[a]);
			}
		}

		return el;
	};

	/**
	 *  removes the node from the dom
	 *  @arg node: can be selector String, Array, Node, or NodeList
	 *  @arg toNode: optional, removes node from this element. defaults to document.body. Can be a node or a single-element selector string.
	 *  @return: Node or NodeList that was removed
	 */
	dom.remove = function (node, fromNode) {

		var parent = fromNode || document.body,
			n = typeof node == "string" ? dom._(node, fromNode) : node;

		function _rm(_n) {
			if (parent.contains(_n)) {
				_n.parentElement.removeChild(_n);
			}
		}

		if (typeof parent == "string") {
			parent = dom._(parent);
		}

		if (n instanceof Node) {
			_rm(n);
			return n;
		} else if (n instanceof NodeList || n instanceof Array || n instanceof StaticNodeList) {
			var i = n.length;
			while (i--) {
				_rm(n[i]);
			}
			return n;
		} else if (n == undefined) {
			return;
		}

		throw new TypeError("node argument needs to be a Node, String, Array, or NodeList!");
	};


	/**
	 *  adds the node to the dom
	 *  @arg node: the Node/NodeList to add, or type of Element to create
	 *  @arg toNode: optional, adds Node to this Element. defaults to document.body. Can be a Node or a single-element selector string.
	 *  @arg attributes: object of attributes to apply to the element
	 *  @return the Node added to the DOM
	 */
	dom.add = function (node, toNode, attributes) {

		var parent = toNode || document.body,
			n = node;

		function _add(_n) {
			parent.appendChild(_n);
		}

		if (typeof parent == "string") {
			parent = dom._(parent);
		}

		function _applyAttribs(el) {
			if (attributes) {
				for (var a in attributes) {
					el.setAttribute(a, attributes[a]);
				}
			}
		}

		// if it's a dom element, just add it
		if (n instanceof Node) {
			_add(n);
			_applyAttribs(n);
			return n;
		} else if (typeof node == "string") {
			n = document.createElement(n);
			_add(n);
			_applyAttribs(n);
			return n;
		} else if (n instanceof NodeList || n instanceof Array) {
			var frag = document.createDocumentFragment();
			var i = n.length;
			while (i--) {
				_applyAttribs(n[i]);
				frag.appendChild(n[i].clone(true));
			}
			_add(frag);
			return frag.childNodes;
		}

		throw new TypeError("node argument needs to be a Node, String, Array, or NodeList!");
	};

	/**
	 * @arg node: node to insert
	 * @arg index: position node will be inserted at
	 * @arg toNode: parent Node to insert child into
	 */
	dom.insert = function (node, index, toNode) {
		var to = toNode || document.body, n;
		typeof to == "string" ? to = dom._(to) : false;
		typeof node == "string" ? n = dom.tag(node) : n = node;
		return to.insertBefore(n, to.childNodes[index]);
	};

	dom.find = function (node, inNode) {
		var inNode = inNode || document;
		if (typeof node == "string") {
			var targ = dom._(node, inNode);
			return targ;
		} else if (inNode.querySelector(node) != undefined) {
			return node;
		} else return false;

	};

	/**
	 *  @arg node: can be a selector string, Node or NodeList
	 *  @arg deep: optional. defaults to true. determines if Node/s will be deep copies or not
	 *  @note: cloned nodes do not include event listeners
	 */
	dom.clone = function (node, deep) {
		if (deep == undefined) {
			deep = true;
		}

		typeof node == "string" ? node = dom._(node) : false;

		if (node instanceof Node) {
			return node.cloneNode(deep);
		} else if (node instanceof NodeList) {

			var frag = document.createDocumentFragment();
			var i = node.length;
			while (i--) {
				frag.appendChild(node[i].cloneNode(deep));
			}

			return frag.childNodes;
		}

		throw new TypeError("node argument should be a Node or NodeList!");
	};

	/**
	 *  @arg optNodes Array of Nodes, or NodeList, or text (xml or whatever) to add to the fragment
	 *  @return: a DocumentFragment
	 */
	dom.Fragment = function (optNodes) {
		var frag = document.createDocumentFragment();
		if (optNodes) {
			if (typeof optNodes == "string") {
				var div = dom.tag("div", optNodes);
				optNodes = div.childNodes;
			}

			for (var i = 0, maxi = optNodes.length; i < maxi; i++) {
				frag.appendChild(optNodes[i]);
			}
		}
		return frag;
	};

	//TODO - make this more flexible, maybe
	dom.stringify = function (xmlNode) {
		if (typeof window.XMLSerializer != "undefined") {
			return (new window.XMLSerializer()).serializeToString(xmlNode);
		} else if (typeof xmlNode.xml != "undefined") {
			return xmlNode.xml;
		}
		return "";
	}
})();
// Original file: extend.js
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

// Original file: Mouse.js
Mouse = new (function () {

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

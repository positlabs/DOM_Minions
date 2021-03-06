/**
 *
 *  Makes minions from ordinary DOM elements. Good for conquering the internet.
 *
 *  @see: Node object documentation - http://www.w3schools.com/jsref/dom_obj_node.asp
 *
 */
define(["tags"], function (tags) {
	console.log("tags",tags);

	/**
	 *  @arg selector: selector string
	 *  @arg context: optional context to search in. defaults to document.body
	 *  @return: Node or NodeList
	 */
	var dom = function (selector, context) {
		var inNode;
		if (typeof context == "string") {
			inNode = document.querySelectorAll(context);
		} else {
			inNode = context || document;
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
	dom.tag = tags.tag;

	/**
	 *  removes the node from the dom
	 *  @arg node: can be selector String, Array, Node, or NodeList
	 *  @arg toNode: optional, removes node from this element. defaults to document.body. Can be a node or a single-element selector string.
	 *  @return: Node or NodeList that was removed
	 */
	dom.remove = function (node, fromNode) {

		var parent = fromNode || document.body,
			n = typeof node == "string" ? dom(node, fromNode) : node;

		function _rm(_n) {
			if (parent.contains(_n)) {
				_n.parentElement.removeChild(_n);
			}
		}

		if (typeof parent == "string") {
			parent = dom(parent);
		}

		if (dom.isNode(n)) {
			_rm(n);
			return n;
		} else if (dom.isNodeList(n) || n instanceof Array) {
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
			parent = dom(parent);
		}

		function _applyAttribs(el) {
			if (attributes) {
				for (var a in attributes) {
					el.setAttribute(a, attributes[a]);
				}
			}
		}

		// if it's a dom element, just add it
		if (dom.isNode(n)) {
			_add(n);
			_applyAttribs(n);
			return n;
		} else if (typeof node == "string") {
			n = document.createElement(n);
			_add(n);
			_applyAttribs(n);
			return n;
		} else if (dom.isNodeList(n) || n instanceof Array) {
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
		typeof to == "string" ? to = dom(to) : false;
		typeof node == "string" ? n = dom.tag(node) : n = node;
		return to.insertBefore(n, to.childNodes[index]);
	};

	dom.find = function (node, inNode) {
		var inNode = inNode || document;
		if (typeof node == "string") {
			var targ = dom(node, inNode);
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

		typeof node == "string" ? node = dom(node) : false;

		if (dom.isNode(node)) {
			return node.cloneNode(deep);
		} else if (dom.isNodeList(node)) {

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
	};

	/**
	 *  stupid IE8 hack for instanceof Element throwing an error instead of returning false
	 * */
	dom.isNode = function(n){
		var isNode = false;
		try{
			isNode = n instanceof Node;
		}catch(e){
		}
		return isNode;
	};

	dom.isNodeList = function(n){
		var isNodeList = false;
		try{
			isNodeList = n instanceof NodeList || n instanceof StaticNodeList;
		}catch(e){
		}
		return isNodeList;
	};

	function merge(hostObj, newObj) {
		for (var f in newObj) {
			hostObj[f] = newObj[f];
		}
	}

	merge(dom, tags);

	return dom;
});
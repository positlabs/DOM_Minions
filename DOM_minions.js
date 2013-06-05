/**
 *
 *  Makes minions from ordinary DOM elements. Good for conquering the internet.
 *
 *  @see: Node object documentation - http://www.w3schools.com/jsref/dom_obj_node.asp
 *
 */


/**
 *  @arg selector: selector string
 *  @arg optInNode: optional Node to search in. defaults to document.body
 *  @return: Node or NodeList
 */
dom = function (selector, optInNode) {
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
 *  @arg content: innerHTML of the new tag, can be of type string or Node
 *  @return: the newly created element
 */
dom.create = function (tagName, content) {
	var el = document.createElement(tagName);
	if (content) {

		if (typeof content == "string") {
			el.innerHTML = content;
		} else {
			el.appendChild(content);
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
		n = typeof node == "string" ? dom(node, fromNode) : node;

	function _rm(_n) {
		if (parent.contains(_n)) {
			_n.parentElement.removeChild(_n);
		}
	}

	if (typeof parent == "string") {
		parent = dom(parent);
	}

	if (n instanceof Node) {
		_rm(n);
		return n;
	} else if (n instanceof NodeList || n instanceof Array) {
		var i = n.length;
		while (i--) {
			_rm(n[i]);
		}
		return n;
	}else if(n == undefined)return;

	throw new TypeError("node argument needs to be a Node, String, Array, or NodeList!");
};


/**
 *  adds the node to the dom
 *  @arg node: the Node/NodeList to add, or type of Element to create
 *  @arg toNode: optional, adds Node to this Element. defaults to document.body. Can be a Node or a single-element selector string.
 *  @return the Node added to the DOM
 */
dom.add = function (node, toNode) {

	var parent = toNode || document.body,
		n = node;

	function _add(_n) {
		parent.appendChild(_n);
	}

	if (typeof parent == "string") {
		parent = dom(parent);
	}

	// if it's a dom element, just add it
	if (n instanceof Node) {
		_add(n);
		return n;
	} else if (typeof node == "string") {
		n = document.createElement(n);
		_add(n);
		return n;
	} else if (n instanceof NodeList || n instanceof Array) {
		var frag = document.createDocumentFragment();
		var i = n.length;
		while (i--) {
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
	typeof node == "string" ? n = dom.create(node) : n = node;
	return to.insertBefore(n, to.childNodes[index]);
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
 *  @arg optNodes Array of Nodes, or NodeList to add to the fragment
 *  @return: a DocumentFragment
 */
dom.Fragment = function (optNodes) {
	var frag = document.createDocumentFragment();
	if (optNodes) {
		for (var i = 0, maxi = optNodes.length; i < maxi; i++) {
			frag.appendChild(optNodes[i]);
		}
	}
	return frag;
};

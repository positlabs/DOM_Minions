define(function () {

	var taglist = [
		"a",
		"abbr",
		"address",
		"area",
		"article",
		"aside",
		"audio",
		"b",
		"base",
		"bb",
		"bdi",
		"bdo",
		"blockquote",
		"body",
		"br",
		"button",
		"canvas",
		"caption",
		"cite",
		"code",
		"col",
		"colgroup",
		"command",
		"data",
		"datagrid",
		"datalist",
		"dd",
		"del",
		"details",
		"dfn",
		"div",
		"dl",
		"dt",
		"em",
		"embed",
		"eventsource",
		"fieldset",
		"figcaption",
		"figure",
		"footer",
		"form",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"head",
		"header",
		"hgroup",
		"hr",
		"html",
		"i",
		"iframe",
		"img",
		"input",
		"ins",
		"kbd",
		"keygen",
		"label",
		"legend",
		"li",
		"link",
		"mark",
		"map",
		"menu",
		"meta",
		"meter",
		"nav",
		"noscript",
		"object",
		"ol",
		"optgroup",
		"option",
		"output",
		"p",
		"param",
		"pre",
		"progress",
		"q",
		"ruby",
		"rp",
		"rt",
		"s",
		"samp",
		"script",
		"section",
		"select",
		"small",
		"source",
		"span",
		"strong",
		"style",
		"sub",
		"summary",
		"sup",
		"table",
		"tbody",
		"td",
		"textarea",
		"tfoot",
		"th",
		"thead",
		"time",
		"title",
		"tr",
		"track",
		"u",
		"ul",
		"var",
		"video",
		"wbr"
	];

	function tag(tagName, content, attributes) {
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
	}


	var tags = {tag:tag};

	for (var i = 0, maxi = taglist.length; i < maxi; i++) {
		(function () {
			var tagName = taglist[i];
			tags[tagName] = function (content, attributes) {
				return tag(tagName, content, attributes);
			}
		})();
	}

	return tags;

});
requirejs.config({
	baseUrl: "../src/"
});

requirejs(["dom", "Mouse", "extend"], function (dom, Mouse) {

	var div = dom.add("div");
	div.className = "hello-world";
	div.add("hr");
	div.add("hr");
	var hr = div.add("hr");
	div.remove(hr);
	div.remove("hr");

	div.add(dom.tag("h1", "hello"));

	var h1 = dom.find(".hello-world");
	h1.css({"background-color": "cyan", "height": "100px", "width": "100px"});

	div.add(dom.tag("h2", "world"));
	var h2 = div.find("h2");
	h2.css({"color": "red"});

});


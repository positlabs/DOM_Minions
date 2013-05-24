DOM_Minions
==========
Makes minions from ordinary DOM elements; Good for conquering the internet. Simple selector queries, event handling, and dom manipulation.

Documentation is in-line. Look at the code for details.


DOM_Minions.js
==========

Various methods for dom manipulation. It's very flexible - most methods will accept selector strings, Nodes, NodeLists, or Arrays of Nodes as arguments.

```javascript

// returns div with id "hello"
dom("#hello");

// makes a header tag with some text in it
var knight = dom.create("h1", "I'm a knight!");
knight.id = "arthur"

// wraps the knight in some armor
var armor = dom.create("div", knight);

// add armored knight to the battlefield (document.body)
dom.add(armor);

// Running short on knights. Make a clone.
var knightClone = knight.clone();
knightClone.id = "bartholemew";

// Running short on armor. Maybe two knights will fit.
dom.insert(knightClone, 1, armor);

// hmm... remove one of them
dom.remove('#arthur', armor);

```

BootCamp.js
==========

Include this file if you want to train existing Nodes / NodeLists to become DOM minions. It extends the prototypes with methods in DOM_Minions.js.
Also adds some methods for event handling

```javascript

// make a minion, handle click and touchstart events
var minion = dom.add("div");
minion.className = "minion";
minion.on("click touchstart", function(){console.log("hail santa!")});

// add an event listener to all minions
var minions = dom(".minions");
minions.on("mousemove touchmove", petMinion);

// remove petMinion listener from all minions
minions.off("mousemove touchmove", petMinion);

// minions are misbehaving! confiscate their weapons
var shanks = minions.find(".weapon");
minions.remove(shanks);


```

© 2013 posit labs
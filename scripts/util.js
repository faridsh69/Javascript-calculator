//-------------------------------------------------------------------------------------------------
//Ampliación de la funcionalidad de un Array
//-------------------------------------------------------------------------------------------------
Array.prototype.indexOf = function(o) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == o) {
			return i;
		};
	};
	return - 1;
};

Array.prototype.lastIndexOf = function(o) {
	for (var i = this.length - 1; i >= 0; i--) {
		if (this[i] == o) {
			return i;
		};
	};
	return - 1;
};

Array.prototype.contains = function(o) {
	return this.indexOf(o) != -1;
};

Array.prototype.remove = function(o) {
	var i = this.indexOf(o);
	if (i != -1) {
		this.splice(i, 1);
	};
};

Array.prototype.insertAt = function(o, i) {
	this.splice(i, 0, o);
};

Array.prototype.insertBefore = function(o, o2) {
	var i = this.indexOf(o2);
	if (i == -1) {
		this.push(o);
	} else {
		this.splice(i, 0, o);
	};
};

Array.prototype.insertAfter = function(o,o2) {
	var i = this.indexOf(o2);
	if (i == -1 || i == (this.length - 1)) {
		this.push(o);
	} else {
		this.splice(i + 1, 0, o);
	};
};

Array.prototype.removeAt = function(i) {
	this.splice(i,1);
};

Array.prototype.remove = function(o) {
	var i = this.indexOf(o);
	if (i != -1) {
		this.splice(i,1);
	};
};

Array.prototype.copy = function() {
	return this.concat();
};

Array.prototype.getLast = function() {
	return this[this.length - 1];
};

Array.prototype.getFirst = function() {
	return this[0];
};

//-------------------------------------------------------------------------------------------------
//Ampliacion de la funcionalidad de un String
//-------------------------------------------------------------------------------------------------

String.prototype.trimLeft = new Function("return this.replace(/^\\s+/,'')");

String.prototype.trimRight = new Function("return this.replace(/\\s+$/,'')");

String.prototype.trim = new Function("return this.replace(/^\\s+|\\s+$/g,'')");

//-------------------------------------------------------------------------------------------------
//Ampliacion de la funcionalidad de una Function (herencia en javascript)
//-------------------------------------------------------------------------------------------------

Function.prototype.extend = function(sFunction, tClassName) {
	if (typeof sFunction != "function") {
		throw new Error("Extend:Function/Constructor to extend from is not a function:" + sFunction);
	};
	if (typeof tClassName != "string") {
		throw new Error("Extend:Missing or malformed className:" + tClassName);
	};
	proto = this.prototype = new sFunction;
	proto.superclass = sFunction;
	proto.classname = tClassName;
	proto.constructor = this;
	return proto;
};


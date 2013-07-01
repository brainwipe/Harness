/**
 * Concatenates the values of a variable into an easily readable string. Like var_dump in php.
 * by Matt Hackett [scriptnode.com]
 * @param {Object} x The variable to debug
 * @param {Number} max The maximum number of recursions allowed (keep low, around 5 for HTML elements to prevent errors) [default: 10]
 * @param {String} sep The separator to use between [default: a single space ' ']
 * @param {Number} l The current level deep (amount of recursion). Do not use this parameter: it's for the function's own use
 */
function print_r(x, max, sep, l) {

	l = l || 0;
	max = max || 10;
	sep = sep || ' ';

	if (l > max) {
		return "[WARNING: Too much recursion]\n";
	}

	var
		i,
		r = '',
		t = typeof x,
		tab = '';

	if (x === null) {
		r += "(null)\n";
	} else if (t === 'object') {

		l++;

		for (i = 0; i < l; i++) {
			tab += sep;
		}

		if (x && x.length) {
			t = 'array';
		}

		r += '(' + t + ") :\n";

		for (i in x) {
			try {
				r += tab + '[' + i + '] : ' + print_r(x[i], max, sep, (l + 1));
			} catch(e) {
				return "[ERROR: " + e + "]\n";
			}
		}

	} else {

		if (t === 'string') {
			if (x === '') {
				x = '(empty)';
			}
		}

		r += '(' + t + ') ' + x + "\n";

	}

	return r;

}
var_dump = print_r;

/**
 * Syntactic sugar
 * Extends the string prototype to have a 'format' function on it.
 * Usage: "some string with {0} in it".format("balls");
 * would give: "some string with balls in it";
 */
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] !== 'undefined' ?
			args[number] :
			match
      ;
    });
  };
}


function RemoveFromArray(thearray, object) {
	var index = thearray.indexOf(object);
	if(index >= 0) {
		return thearray.splice(index, 1)[0];
	}
	else {
		return undefined;
	}
}

function FindRequireJSModulesByObjectName(namespace) {
	var definedFunctions = require.s.contexts._.defined;
	var outputModules = {};
	for(var key in definedFunctions)
	{
		if (key.indexOf(namespace) !== -1)
		{
			var objectKey = key.substr(key.lastIndexOf('/') + 1);
			outputModules[objectKey] = definedFunctions[key];
		}
	}
	return outputModules;
}
setInterval(function() {
	//var code = document.getElementsByClassName("chat-line__message");
	var messagesCode = document.querySelectorAll('[data-a-target="chat-message-text"]');
	var emoteCode = document.querySelectorAll('[data-a-target="emote-name"]');
	var messages = [];
	var emotes = [];
	// Array.prototype.forEach.call(code, function(child) { messages.push(child.children[3].innerText)});
	messagesCode.forEach(function(x) {
		messages.push(x.innerHTML);
	});
	emoteCode.forEach(function(emote) {
		emotes.push(emote.children[0].alt);
	});
	// at this point the variable 'messages' is an array containing all of the lines in chat
	var gram4 = ngrams(4, messages);
	var gram3 = ngrams(3, messages);
	var gram2 = ngrams(2, messages);
	var gram1 = ngrams(1, emotes);
	var max = 0;
	var maxString = "";
	//var gram = Object.assign(gram1, gram2, gram3, gram4);
	var length = 0;
	for (key in gram1) {
		length += gram1[key]
	}
	var output = "";
	for (key in gram1) {
		if (gram1[key] / length > 0.15) {
			output += key + " ";
		}
	}
	console.log("Emotes: " + output);
	
}, 3000);
// returns an object representing the n grams
// for example, ngram["tree"] = # of occurrences
function ngrams(n, words) {
	var grams = new Object();
	Array.prototype.forEach.call(words, function(line) {
		words = line.split(" ");
		if (words.length < n) {
			return;
		}
		else if (words.length == n)
			addItem(line, grams);
		else {
			for (var i = 0; i + n < words.length; i++) {
				var newString = "";
				for (var j = 0; j < n; j++) {
					newString += words[i + j] + " ";
				}
				addItem(newString.trim(), grams);
			}
		}
	});
	return grams;
}
function addItem(item, list) {
	if (list[item])
		list[item]++;
	else
		list[item] = 1;
}
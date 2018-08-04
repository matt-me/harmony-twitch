var IGNORE_WORDS = ["a", "the", "you", "a", "is", "that", "this", "I", "to", "in", "of", "it", "and", "", "have", "but", "i", "are", "for", "so", "on", "just", "all", "know", "u", "from", "or"];
var recentAmount = 100;
function startInterval(interval) {
	var rawformattedMessages = browser.tabs.getCurrent().getElementsByClassName("chat-line__message");
	rawformattedMessages.then(function() {
		setInterval(function() {
			var formattedMessages = new Array();
			for (idx in rawformattedMessages) {
				message = rawformattedMessages[idx]
				var text2 = ""; // this will encompass the text of each message
				if (!message.children) {
					continue;
				}
				for (var i = 3; i < message.children.length; i++) {
					if (message.children[i].getAttribute("data-a-target") === "chat-message-text") {
						text2 += message.children[i].innerHTML + "";
					} else if (message.children[i].getAttribute("data-a-target") === "emote-name") {
						text2 += ":" + message.children[i].children[0].alt + ":";
					} else if (message.children[i].getAttribute("data-a-target") === "chat-message-mention") {
						text2 += message.children[i].innerHTML + "";
					}
				}
				formattedMessages.push(text2);
			}
			// now all of the messages are in an array by line. emotes are included, and are surrounded by : like so -> ":PogChamp:"
			// now to get rid of any messages that 
			while(recentAmount < formattedMessages.length) {
				formattedMessages.shift();
			}
			console.log("Lines processed: " + formattedMessages.length);
			console.log("=================================");
			var gram1 = ngrams(1, formattedMessages, 3);
			// remove the unwanted words from the 1-gram list.
			// this is just to keep non-descriptive words like "the" from appearing the most commonly
			for (var i = 0; i < IGNORE_WORDS.length; i++) {
				gram1[IGNORE_WORDS[i]] = 0;
			}
			// get the n most popular words from the list of grams
			var highest = getNPopular(5, gram1);
			for (var i = 0; i < highest.length; i++) {
				console.log(highest[i] + ": " + gram1[highest[i]]);
			}
			var length = 0;
			for (key in gram1) {
				length += gram1[key]
			}
			list = gram1.Array();
			console.log("Total words: " + length);
			WordCloud(browser.tabs.getCurrent().getElementById('my_canvas'), { list: list } );
			
		}, interval);
	});
}



// given an object "list" with attributes: list["attribute"] = number
// this will return n attributes with the highest 'number' in order in an array
function getNPopular(n, list) {
	var output = [];
	for (var i = 0; i < n; i++) {
		output[i] = "";
	}
	// construct the output array
	for (key in list) {
		for (var i = 0; i < output.length; i++) {
			if (list[key] > list[output[i]]) {
				for (var j = output.length - 1; j > i; j--) {
					output[j] = output[j - 1];
				}
				output[i] = key;
				break;
			}
		}
	}
	return output;
}
// returns an object representing the n grams
// for example, ngram["tree"] = # of occurrences in the array of strings "words"
// the parameter 'maxPerMessage' gives the amount of times an n-gram can be matched from a single message
// This prevents people from spamming the same word over and over to make it seem common.
// Ex. "PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp"
function ngrams(n, words, maxPerMessage) {
	var grams = {};
	Array.prototype.forEach.call(words, function(line) {
		wordsList = line.toLowerCase().split(" ");
		if (wordsList.length < n) {
			return;
		}
		else if (wordsList.length == n)
			addItem(line, grams);
		else {
			for (var i = 0; i + n < wordsList.length; i++) {
				var counter = {};
				var newString = ""; // the word itself that is being turned into a gram
				for (var j = 0; j < n; j++) {
					newString += wordsList[i + j] + " ";
				}
				if (!counter[newString.trim()] || counter[newString.trim()] < maxPerMessage) {
					addItem(newString.trim(), grams);
					addItem(newString.trim(), counter);
				}
			}
		}
	});
	for (word1 in grams) {
		// var elongations = new Array();
		for (word2 in grams) {
			if (word1 !== word2 && isElongated(word1, word2)) {
				if (grams[word1] < grams[word2]) {
					grams[word2] += grams[word1];
					grams[word1] = 0;
				} else {
					grams[word1] += grams[word2]
					grams[word2] = 0;
				}
			}
		}
	}
	return grams;
}
function addItem(item, list) {
	if (list[item])
		list[item]++;
	else
		list[item] = 1;
}
// returns if a word is an elongated version of another.
//isElongated("lol", "looool") -> returns true
function isElongated(word1, word2) {
  for (var i = 0; i < Math.min(word1.length, word2.length); i++) {
    if (word1[i] === word2[i]) {
      while (word1[i+1] === word1[i])
        word1 = word1.replace(word1[i], "");
      while (word2[i+1] === word2[i])
        word2 = word2.replace(word2[i], "");
    } else {
      return false;
    }
  }
  return word1 === word2;
}
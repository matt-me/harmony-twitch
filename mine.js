var IGNORE_WORDS = ["a", "the", "you", "a", "is", "that", "this", "I", "to", "in", "of", "it", "and", "", "have", "but", "i", "are", "for", "so", "on", "just", "all", "know", "u", "from", "or"];
var recentAmount = 100;




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

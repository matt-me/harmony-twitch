function ngrams(n, words) {
	var grams = new Object();
	forEach(words, function(line) {
		words = line.split(" ");
		if (words.length < n) {
			return;
		else if (words.length == n)
			addItem(line, grams);
		else {
			for (int i = 0; i + n < words.length; i++) {
				var newString = "";
				for (int j = 0; j < n; j++) {
					newString += words[j] + " ";
				}
				addItem(newString.trim(), grams);
			}
		}
	}
}
function addItem(item, list) {
	if (list[item])
		list[item]++;
	else
		list[item] = 1;
}
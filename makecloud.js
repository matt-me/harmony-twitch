(function () {
	browser.tabs.executeScript({file: "lib/wordcloud2.js/src/wordcloud2.js"})
	.then(browser.tabs.executeScript({file: "background.js"}))
	.then(browser.tabs.executeScript({file: "twitchApplet.js"}));
})();
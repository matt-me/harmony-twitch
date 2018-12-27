(function () {
    if (!document.getElementById('my_canvas')) {
        var canvas = document.createElement('canvas')
        canvas.id = 'my_canvas'
        canvas.height = 400;
        document.body.appendChild(canvas);
    }
    var rawformattedMessages = document.getElementsByClassName("chat-line__message");
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
    while (recentAmount < formattedMessages.length) {
        formattedMessages.shift();
    }
    // console.log("Lines processed: " + formattedMessages.length);
    // console.log("=================================");
    var gram1 = ngrams(1, formattedMessages, 3);
    // remove the unwanted words from the 1-gram list.
    // this is just to keep non-descriptive words like "the" from appearing the most commonly
    for (var i = 0; i < IGNORE_WORDS.length; i++) {
        gram1[IGNORE_WORDS[i]] = 0;
    }
    // get the n most popular words from the list of grams
    var highest = getNPopular(100, gram1);
    var list = [];
    for (var i = 0; i < highest.length; i++) {
        list.push([highest[i], ]);
    }
    WordCloud(document.getElementById('my_canvas'), {
        gram1: gram1,
        gridSize: 16,
        weightFactor: 16,
        origin: [90, 0],
        fontFamily: 'Times, serif',
        color: 'random-light',
        backgroundColor: '#000',
        shuffle: false,
        rotateRatio: 0
    });
    console.log(gram1);
})();
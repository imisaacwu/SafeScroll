var targetWords = [];

chrome.runtime.onMessage.addListener(msgObj => {
    if (msgObj != null) {
        var elements = document.querySelectorAll(".blur");
        [].forEach.call(elements, function(element) {
            element.classList.remove("blur");
            element.style.webkitFilter = "blur(" + 0 + ")";
            element.setAttribute("blur-level", 2);
        });

        targetWords = [];
        for (i = 0; i < msgObj.length; i++) {
            targetWords[i] = msgObj[i].task;
        }
        wrapTextInSpanWithClass("blur");
        blurAll();
    }
});

const rootNode = document.body;

function wrapTextInSpanWithClass(className) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    while (walker.nextNode()) {
        var textNode = walker.currentNode;
        var text = textNode.nodeValue;
        var words = text.split(" ");

        for (i = 0; i < words.length; i++) {
            if (targetWords.includes(words[i].toLowerCase().replace( /\W/g , ''))) {
                textNode.parentNode.classList.add(className);
            }
        }
    }
}


var BLUR_LEVELS = ["10px", "4px", "0px"];

var article = document.querySelector("*")

article.addEventListener("click",
    (event) => {
        var element = event.target;
        if (element.className == "blur") {
            blurElement(element);
        }
    },
);

function blurAll() {
    var toBeBlurred = document.querySelector("*").getElementsByClassName("blur");
    var len = toBeBlurred.length;

    for (i = 0; i < len; i++) {
        var element = toBeBlurred.item(i);
        element.style.webkitFilter = "blur(" + BLUR_LEVELS[0] + ")";
        element.setAttribute("blur-level", 0);
    }
}

function blurElement(element) {
    var elementBlurLevel = element.getAttribute("blur-level") || 0;
    var nextBlurLevel = (parseInt(elementBlurLevel) + 1) % BLUR_LEVELS.length;

    element.style.webkitFilter = "blur(" + BLUR_LEVELS[nextBlurLevel] + ")";

    element.setAttribute("blur-level", nextBlurLevel);
}
function loadEntries(callback) {
    setTimeout(function () {
        var xhttp = null;
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", "asset/entries.json", true);
        xhttp.send();
    }, 0)
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

var formatter = (function () {
    // var regEx = /{([^{]*?)}/g;
    var regEx = /{{([^{]*?)}}/g;
    var requiresSubstitution = function (str) {
        return regEx.test(str);
    };

    var getSubstituteValue = function (context) {
        return function (regexMatch, placeholder) {
            var splitArray = placeholder.split(".");
            var currentContext = context;
            while (splitArray.length) {
                var item = splitArray.shift().trim();
                if (typeof(currentContext) === "object" && item in currentContext)
                    currentContext = currentContext[item];
                else
                    return;
            }
            return currentContext;
        };
    };

    return function (input, context) {
        if (requiresSubstitution(input)) {
            input = input.replace(regEx, getSubstituteValue(context));
        }
        return input
    };
})();

var getProperty = (function () {
    return function (context, contextStr) {
        var splitArray = contextStr.split(".");
        var currentContext = context;
        while (splitArray.length) {
            var item = splitArray.shift().trim();
            if (typeof(currentContext) === "object" && item in currentContext)
                currentContext = currentContext[item];
            else
                return;
        }
        return currentContext;
    }
})();
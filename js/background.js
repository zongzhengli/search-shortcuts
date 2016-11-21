(function () {
    browser.browserAction.onClicked.addListener(function(tab) {
        alert("background.js");
    });

    browser.webRequest.onBeforeRequest.addListener(
        function(details) {
            var redirectUrl = details.url;
            var search = getSearchParameters(details.url);
            if (search) {
                if (search[0] === "r") {
                    redirectUrl = "https://reddit.com/r/" + search[1];
                }
            }
            return { redirectUrl: redirectUrl };
        },
        {
            urls: [
                "*://google.com/*",
                "*://www.google.com/*",
            ],
            types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking"]
    );

    function getSearchParameters(url) {
        var search = getQueryParameters(url)["q"];
        var spaceIndex = search && search.indexOf(" ");
        if (!spaceIndex || spaceIndex <= 0 || spaceIndex >= search.length)
            return null;
        return [search.substr(0, spaceIndex), search.substr(spaceIndex + 1)];
    }

    function getQueryParameters(url) {
        var kvps = (url.split("?")[1] || "").split("&");
        var params = {};
        for (var i = 0; i < kvps.length; i++) {
            var kvp = kvps[i].split("=");
            params[kvp[0]] = decodeURIComponent((kvp[1] || "").replace(/\+/g, " "));
        }
        return params;
    }
})();
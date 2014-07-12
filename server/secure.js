BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowConnect();

var rootUrl = __meteor_runtime_config__.ROOT_URL;
BrowserPolicy.content.allowConnectOrigin(rootUrl);
BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'ws'));
BrowserPolicy.content.allowConnectOrigin("*.kadira.io");
BrowserPolicy.content.allowConnectOrigin("http://kadira.io");
BrowserPolicy.content.allowOriginForAll("*.theostylesdev.co.uk");
BrowserPolicy.content.allowOriginForAll("theostylesdev.co.uk");

BrowserPolicy.content.allowOriginForAll("*.facebook.net");
BrowserPolicy.content.allowOriginForAll("*.facebook.com");
BrowserPolicy.content.allowInlineScripts("*.facebook.net");
BrowserPolicy.content.allowInlineScripts("*.facebook.com");
BrowserPolicy.content.allowInlineStyles("*.facebook.com");
BrowserPolicy.content.allowInlineStyles("*.facebook.net");
BrowserPolicy.content.allowEval("*.facebook.net");
BrowserPolicy.content.allowEval("*.facebook.com")

BrowserPolicy.content.allowOriginForAll("*.twitter.com");
BrowserPolicy.content.allowInlineScripts("*.twitter.com");
BrowserPolicy.content.allowInlineStyles("*.twitter.com");
BrowserPolicy.content.allowEval("*.twitter.com");

BrowserPolicy.content.allowOriginForAll("*.google.com");
BrowserPolicy.content.allowInlineScripts("*.google.com");
BrowserPolicy.content.allowInlineStyles("*.google.com");
BrowserPolicy.content.allowEval("*.google.com");
BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
BrowserPolicy.content.allowInlineScripts("*.gstatic.com");
BrowserPolicy.content.allowInlineStyles("*.gstatic.com");
BrowserPolicy.content.allowEval("*.gstatic.com");

BrowserPolicy.content.allowOriginForAll("*.pinterest.com");
BrowserPolicy.content.allowInlineScripts("*.pinterest.com");
BrowserPolicy.content.allowInlineStyles("*.pinterest.com");
BrowserPolicy.content.allowEval("*.pinterest.com");

BrowserPolicy.content.allowImageOrigin("http://lorempixel.com/");

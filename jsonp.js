/*
* Lightweight JSONP fetcher
* Copyright 2010-2012 Erik Karlsson. All rights reserved.
* Copyright 2014 Eugene Mirotin — code refactoring, UMD, Bower support.
* BSD licensed
*/


/*
* Usage:
*
* JSONP.get('someUrl.php', {param1:'123', param2:'456'}, function (data) {
*   //do something with data, which is the JSON object you should retrieve from someUrl.php
* });
*/

(function () {
  var glob = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;

  if (!glob) {
    throw new Error("Unknown environment, can't attach to global variable");
  }

  var exportName = 'JSONP',
    _prev = glob[exportName],
    counter = 0,
    head,
    config = {};

  function load(url, pfnError) {
    var script = document.createElement('script'),
      done = false;
    script.src = url;
    script.async = true;

    var errorHandler = pfnError || config.error;
    if (typeof errorHandler === 'function') {
      script.onerror = function (ex) {
        errorHandler({url: url, event: ex});
      };
    }

    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };

    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  }

  function encode(str) {
    return encodeURIComponent(str);
  }

  function jsonp(url, params, callback, callbackName) {
    var query = (url || '').indexOf('?') === -1 ? '?' : '&',
      key;

    callbackName = callbackName || config.callbackName ||'callback';
    var uniqueName = callbackName + "_json" + (++counter);

    params = params || {};
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        query += encode(key) + "=" + encode(params[key]) + "&";
      }
    }

    glob[uniqueName] = function(data) {
      callback(data);
      try {
        glob[uniqueName] = null;
        delete glob[uniqueName];
      } catch (e) {}
    };

    load(url + query + callbackName + '=' + uniqueName);
    return uniqueName;
  }

  function setDefaults(obj) {
    config = obj;
  }

  var exports = {
    get: jsonp,
    init: setDefaults,
    noConflict: noConflict
  };

  function noConflict () {
    glob[exportName] = _prev;
    return exports;
  }

  glob[exportName] = exports;
}());

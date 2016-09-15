"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUriWithCheck = exports.getUriWithRefUrl = undefined;

var _underscore = require("underscore");

var _require = require("url");

var format = _require.format;
var parse = _require.parse;


var sessionPaths = ['login', 'signup', 'forgot-password', 'password-reset', 'signout'];

var getUriWithRefUrl = exports.getUriWithRefUrl = function getUriWithRefUrl(action, refUrl) {
  var pathname = "/" + action;
  if (!refUrl) {
    return pathname;
  }

  return format({
    pathname: pathname,
    query: { ref_url: refUrl }
  });
};

var getUriWithCheck = exports.getUriWithCheck = function getUriWithCheck(isLogged, refUrl) {
  var homePageUri = format({ pathname: '/' });

  if (!refUrl) {
    return homePageUri;
  }

  var refUrlPath = parse(refUrl, true);
  var pathname = refUrlPath.pathname.replace('/', '');

  var isUrlInvalid = (0, _underscore.find)(sessionPaths, function (val) {
    return val === pathname;
  });

  if (isUrlInvalid) {
    return homePageUri;
  } else {
    return format({
      pathname: refUrlPath.path
    });
  }
};
//# sourceMappingURL=form_uri.js.map
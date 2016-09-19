"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUriWithCheck = exports.getUriWithRefUrl = undefined;

var _url = require("url");

var _underscore = require("underscore");

var sessionPaths = ['login', 'signup', 'forgot-password', 'password-reset', 'signout'];

var getUriWithRefUrl = exports.getUriWithRefUrl = function getUriWithRefUrl(action, refUrl) {
  var pathname = "/" + action;
  if (!refUrl || refUrl === 'undefined') {
    return pathname;
  }

  return (0, _url.format)({
    pathname: pathname,
    query: { ref_url: refUrl }
  });
};

var getUriWithCheck = exports.getUriWithCheck = function getUriWithCheck(isLogged, refUrl) {
  var homePageUri = (0, _url.format)({ pathname: '/' });

  if (!refUrl || refUrl === 'undefined') {
    return homePageUri;
  }

  var refUrlPath = (0, _url.parse)(refUrl, true);
  var pathname = refUrlPath.pathname.replace('/', '');

  var isUrlInvalid = (0, _underscore.find)(sessionPaths, function (val) {
    return val === pathname;
  });

  if (isUrlInvalid) {
    return homePageUri;
  } else {
    return (0, _url.format)({
      pathname: refUrlPath.path
    });
  }
};
//# sourceMappingURL=form_uri.js.map
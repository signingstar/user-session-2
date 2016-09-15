"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.presenter = undefined;

var _form_uri = require("../session/form_uri");

var presenter = exports.presenter = function presenter(retUrl, isLogged) {
  var uriWithRef = (0, _form_uri.getUriWithRefUrl)('signup', retUrl);
  var parsedUri = (0, _form_uri.getUriWithCheck)(isLogged, retUrl);

  return { uriWithRef: uriWithRef, parsedUri: parsedUri };
};
//# sourceMappingURL=presenter.js.map
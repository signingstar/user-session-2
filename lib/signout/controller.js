"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signOutController = function signOutController(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;


  return {
    main: function main(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;

      var srcPath = _path2.default.join(__dirname, '../../views/', 'signout');
      var fn = pugCompiler(srcPath);
      res.clearCookie('isLogged');

      (0, _tiskoLayout2.default)({}, page);

      page.set({
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: 'Tisko - Logged out',
        body_class: 'signout'
      });

      var html = fn(page);

      responders.html(html);
    }
  };
};

exports.default = signOutController;
//# sourceMappingURL=controller.js.map
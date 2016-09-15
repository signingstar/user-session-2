'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordResetController = function passwordResetController(_ref) {
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

      var srcPath = _path2.default.join(__dirname, '../../views/', 'password_reset');
      var fn = pugCompiler(srcPath);

      page.set({
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: 'Tisko - Password Reset',
        body_class: 'password-reset'
      });

      var html = fn(page);

      responders.html(html);
    },

    reset_password: function reset_password(_ref3) {
      var attributes = _ref3.attributes;
      var responders = _ref3.responders;
      var page = _ref3.page;
      var req = attributes.req;
      var res = attributes.res;

      var refUrl = decodeURI(req.protocol + '://' + req.get('host'));

      responders.redirectWithCookies(refUrl);
    }
  };
};

exports.default = passwordResetController;
//# sourceMappingURL=controller.js.map
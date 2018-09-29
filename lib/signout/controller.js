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
  var pugCompiler = modules.pugCompiler,
      logger = modules.logger,
      jsAsset = modules.jsAsset,
      cssAsset = modules.cssAsset;

  var srcPath = _path2.default.join(__dirname, '../../views/', 'signout');
  var renderHTML = pugCompiler(srcPath);
  var title = 'Tisko - Logged out';

  return {
    main: function main(_ref2) {
      var attributes = _ref2.attributes,
          responders = _ref2.responders,
          page = _ref2.page;
      var req = attributes.req,
          res = attributes.res;


      res.clearCookie('wibele');

      req.session.destroy(function (err) {
        logger.info('session destroyed');
      });

      (0, _tiskoLayout2.default)({}, page, { jsAsset: jsAsset });

      page.set({
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: title,
        body_class: 'signout'
      });

      responders.html(renderHTML(page));
    }
  };
};

exports.default = signOutController;
//# sourceMappingURL=controller.js.map
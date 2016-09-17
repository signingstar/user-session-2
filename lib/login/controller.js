"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require("underscore");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _presenter = require("./presenter");

var _verify_login = require("./verify_login");

var _verify_login2 = _interopRequireDefault(_verify_login);

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require("debug")("Modules:loginController");

var loginController = function loginController(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;

  var title = 'Tisko - Login';
  var srcPath = _path2.default.join(__dirname, '../../views/', 'login');

  var fn = pugCompiler(srcPath);

  var pageConfig = {
    javascript: jsAsset('sessionjs'),
    stylesheet: cssAsset('sessioncss'),
    title: title,
    body_class: 'login'
  };

  return {
    get: function get(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;
      var cookies = req.cookies;

      var _headerPresenter = (0, _tiskoLayout2.default)({ cookies: cookies, topNav: false }, page, { jsAsset: jsAsset });

      var _headerPresenter$isLo = _headerPresenter.isLogged;
      var isLogged = _headerPresenter$isLo === undefined ? false : _headerPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({
        refUrl: (0, _presenter.presenter)(req.query.ref_url).uriWithRef
      });

      var html = fn(page);

      responders.html(html);
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes;
      var responders = _ref3.responders;
      var page = _ref3.page;
      var req = attributes.req;
      var res = attributes.res;

      var _pick = (0, _underscore.pick)(req.body, function (value, key) {
        return key === 'userid' || key === 'password';
      });

      var userid = _pick.userid;
      var password = _pick.password;


      (0, _verify_login2.default)(userid, password, function (isValid) {
        if (isValid) {
          res.cookie('isLogged', true, { maxAge: 60 * 60 * 1000 });
          var refUrl = (0, _presenter.presenter)(req.query.ref_url, true).parsedUri;
          responders.redirectWithCookies(decodeURIComponent(refUrl));
        } else {
          (0, _tiskoLayout2.default)({ topNav: false }, page, { jsAsset: jsAsset });

          page.set(pageConfig);
          page.set({
            refUrl: (0, _presenter.presenter)(req.query.ref_url).uriWithRef,
            message: 'Invalid login or password'
          });

          var html = fn(page);

          responders.html(html);
        }
      });
    }
  };
};

exports.default = loginController;
//# sourceMappingURL=controller.js.map
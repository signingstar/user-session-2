"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require("underscore");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _presenter = require("./presenter");

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

var _update_user_list = require("./update_user_list");

var _update_user_list2 = _interopRequireDefault(_update_user_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signUpController = function signUpController(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;


  return {
    get: function get(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;

      var srcPath = _path2.default.join(__dirname, '../../views/', 'signup');
      var fn = pugCompiler(srcPath);
      var refUrl = (0, _presenter.presenter)(req.query.ref_url).uriWithRef;
      var cookies = req.cookies;

      var title = 'Tisko - Register';

      var _headerPresenter = (0, _tiskoLayout2.default)({ cookies: cookies, topNav: false }, page);

      var _headerPresenter$isLo = _headerPresenter.isLogged;
      var isLogged = _headerPresenter$isLo === undefined ? false : _headerPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set({
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: title,
        refUrl: refUrl,
        body_class: 'signup'
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

      var refUrl = decodeURI(req.query.ref_url);
      var validFields = ['userid', 'username', 'password', 'telephone'];

      var signupData = (0, _underscore.pick)(req.body, function (value, key) {
        return (0, _underscore.find)(validFields, function (field) {
          return field === key;
        });
      });

      (0, _update_user_list2.default)(signupData, function (state) {
        if (state) {
          res.cookie('isLogged', true, { maxAge: 60 * 60 * 1000 });
          refUrl = (0, _presenter.presenter)(refUrl, true).parsedUri;
          responders.redirectWithCookies(refUrl);
        } else {
          var srcPath = _path2.default.join(__dirname, './', 'main');
          var fn = pugCompiler(srcPath);

          page.set({
            javascript: jsAsset('sessionjs'),
            stylesheet: cssAsset('sessioncss'),
            title: 'Tisko - Register',
            refUrl: refUrl,
            body_class: 'signup',
            message: 'Couldn\`t signed up'
          });

          var html = fn(page);

          responders.html(html);
        }
      });
    }
  };
};

exports.default = signUpController;
//# sourceMappingURL=controller.js.map
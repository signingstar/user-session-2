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

var _authenticate_user = require("../database/api/authenticate_user");

var _authenticate_user2 = _interopRequireDefault(_authenticate_user);

var _form_validator = require("./form_validator");

var _form_validator2 = _interopRequireDefault(_form_validator);

var _respond_error = require("../session/respond_error");

var _respond_error2 = _interopRequireDefault(_respond_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require("debug")("Modules:loginController");

var controller = function controller(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;
  var queryDb = modules.queryDb;

  var title = 'Tisko - Login';
  var srcPath = _path2.default.join(__dirname, '../../views/', 'login');

  var renderHTML = pugCompiler(srcPath);

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
      var session = req.session;

      var _layoutPresenter = (0, _tiskoLayout2.default)({ session: session, topNav: false }, page, { jsAsset: jsAsset });

      var _layoutPresenter$isLo = _layoutPresenter.isLogged;
      var isLogged = _layoutPresenter$isLo === undefined ? false : _layoutPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({
        refUrl: (0, _presenter.presenter)(req.query.ref_url).uriWithRef
      });

      responders.html(renderHTML(page));
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

      var _formValidator = (0, _form_validator2.default)({ userid: userid, password: password });

      var err = _formValidator.err;
      var loginData = _formValidator.loginData;


      if (err) {
        (0, _respond_error2.default)({ err: err, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        return;
      }

      (0, _authenticate_user2.default)(loginData, { logger: logger, queryDb: queryDb }, function (err, result) {
        if (!err) {
          logger.info("LOGIN successful for user: " + loginData[0]);

          req.session.regenerate(function (err) {
            req.session.user = result;
            res.cookie('fortune', result.id, { maxAge: 365 * 24 * 60 * 60 * 1000 });
            var parsedRefUrl = (0, _presenter.presenter)(req.query.ref_url, true).parsedUri;
            responders.redirectWithCookies(decodeURIComponent(parsedRefUrl));
          });
        } else {
          (0, _respond_error2.default)({ err: err, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        }
      });
    }
  };
};

exports.default = controller;
//# sourceMappingURL=controller.js.map
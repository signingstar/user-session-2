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
  var pugCompiler = modules.pugCompiler,
      logger = modules.logger,
      jsAsset = modules.jsAsset,
      cssAsset = modules.cssAsset,
      queryDb = modules.queryDb;

  var title = 'Tisko - Contact Us';
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
      var attributes = _ref2.attributes,
          responders = _ref2.responders,
          page = _ref2.page;
      var req = attributes.req,
          res = attributes.res;
      var user = req.session.user;

      var _layoutPresenter = (0, _tiskoLayout2.default)({ user: user, topNav: false }, page, { jsAsset: jsAsset }),
          _layoutPresenter$isLo = _layoutPresenter.isLogged,
          isLogged = _layoutPresenter$isLo === undefined ? false : _layoutPresenter$isLo;

      if (isLogged) {
        return responders.redirectWithCookies("/");
      }

      page.set(pageConfig);
      page.set({
        refUrl: (0, _presenter.presenter)(req.query.ref_url).uriWithRef
      });

      responders.html(renderHTML(page));
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes,
          responders = _ref3.responders,
          page = _ref3.page;
      var req = attributes.req,
          res = attributes.res;

      var _pick = (0, _underscore.pick)(req.body, function (value, key) {
        return key === 'userid' || key === 'password';
      }),
          userid = _pick.userid,
          password = _pick.password;

      var _formValidator = (0, _form_validator2.default)({ userid: userid, password: password }),
          err = _formValidator.err,
          loginData = _formValidator.loginData;

      if (err) {
        (0, _respond_error2.default)({ err: err, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        return;
      }

      (0, _authenticate_user2.default)(loginData, { logger: logger, queryDb: queryDb }, function (err, result) {
        if (!err) {
          logger.info("LOGIN successful for user: " + result.email);

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
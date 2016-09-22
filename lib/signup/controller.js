"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require("underscore");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _presenter = require("./presenters/presenter");

var _filter_validate = require("./presenters/filter_validate");

var _filter_validate2 = _interopRequireDefault(_filter_validate);

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

var _insert_user = require("../database/api/insert_user");

var _insert_user2 = _interopRequireDefault(_insert_user);

var _respond_error = require("../session/respond_error");

var _respond_error2 = _interopRequireDefault(_respond_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = function controller(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;
  var queryDb = modules.queryDb;


  var srcPath = _path2.default.join(__dirname, '../../views/', 'signup');
  var renderHTML = pugCompiler(srcPath);
  var title = 'Tisko - Register';
  var pageConfig = {
    javascript: jsAsset('sessionjs'),
    stylesheet: cssAsset('sessioncss'),
    body_class: 'signup',
    title: title
  };

  return {
    get: function get(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;

      var refUrl = (0, _presenter.presenter)(req.query.ref_url).uriWithRef;
      var session = req.session;

      var _layoutPresenter = (0, _tiskoLayout2.default)({ session: session, topNav: false }, page, { jsAsset: jsAsset });

      var _layoutPresenter$isLo = _layoutPresenter.isLogged;
      var isLogged = _layoutPresenter$isLo === undefined ? false : _layoutPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({ refUrl: refUrl });

      responders.html(renderHTML(page));
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes;
      var responders = _ref3.responders;
      var page = _ref3.page;
      var req = attributes.req;
      var res = attributes.res;

      var refUrl = req.query.ref_url ? decodeURI(req.query.ref_url) : undefined;

      var _filterAndValidate = (0, _filter_validate2.default)(req.body);

      var err = _filterAndValidate.err;
      var signupData = _filterAndValidate.signupData;


      if (err) {
        (0, _respond_error2.default)({ err: err, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        return;
      }

      (0, _insert_user2.default)(signupData, { logger: logger, queryDb: queryDb }, function (err, result) {
        if (!err) {
          logger.info("SIGNUP successful for user: " + signupData[2]);

          req.session.regenerate(function (err) {
            req.session.user = {
              id: result.user_id,
              first_name: signupData[0],
              last_name: signupData[1],
              email: signupData[2]
            };
            res.cookie('fortune', result.user_id, { maxAge: 365 * 24 * 60 * 60 * 1000 });
            var parsedRefUrl = (0, _presenter.presenter)(refUrl, true).parsedUri;
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
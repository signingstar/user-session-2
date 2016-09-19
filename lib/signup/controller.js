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

var _insert_user = require("../database/api/insert_user");

var _insert_user2 = _interopRequireDefault(_insert_user);

var _form_validator = require("./form_validator");

var _form_validator2 = _interopRequireDefault(_form_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signUpController = function signUpController(_ref) {
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
      var cookies = req.cookies;

      var _headerPresenter = (0, _tiskoLayout2.default)({ cookies: cookies, topNav: false }, page, { jsAsset: jsAsset });

      var _headerPresenter$isLo = _headerPresenter.isLogged;
      var isLogged = _headerPresenter$isLo === undefined ? false : _headerPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({ refUrl: refUrl });

      var html = renderHTML(page);

      responders.html(html);
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes;
      var responders = _ref3.responders;
      var page = _ref3.page;
      var req = attributes.req;
      var res = attributes.res;

      var refUrl = req.query.ref_url ? decodeURI(req.query.ref_url) : undefined;

      var _filterAndValidateFie = filterAndValidateFields(req.body);

      var err = _filterAndValidateFie.err;
      var signupData = _filterAndValidateFie.signupData;


      if (err) {
        respondError({ message: err.message, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        return;
      }

      logger.info("signupData:" + signupData.join('<->'));

      (0, _insert_user2.default)(signupData, { logger: logger, queryDb: queryDb }, function (err, result) {
        if (!err) {
          res.cookie('isLogged', true, { maxAge: 60 * 60 * 1000 });
          var parsedRefUrl = (0, _presenter.presenter)(refUrl, true).parsedUri;
          responders.redirectWithCookies(parsedRefUrl);
        } else {
          respondError({ message: err.message, pageConfig: pageConfig }, { renderHTML: renderHTML, page: page, jsAsset: jsAsset, responders: responders });
        }
      });
    }
  };
};

var filterAndValidateFields = function filterAndValidateFields(bodyContent, cb) {
  var userid = bodyContent.userid;
  var fullname = bodyContent.fullname;
  var password = bodyContent.password;
  var telephone = bodyContent.telephone;
  var confirmpassword = bodyContent.confirmpassword;

  var _formValidator = (0, _form_validator2.default)({ userid: userid, fullname: fullname, password: password, telephone: telephone, confirmpassword: confirmpassword });

  var err = _formValidator.err;
  var formData = _formValidator.formData;


  if (err) {
    return { err: err };
  }

  var name = fullname.split(" ");
  var last_name = name.pop();
  var first_name = name.join(' ');

  return { signupData: [first_name, last_name, userid, password] };
};

var respondError = function respondError(_ref4, modules) {
  var message = _ref4.message;
  var pageConfig = _ref4.pageConfig;
  var jsAsset = modules.jsAsset;
  var page = modules.page;
  var renderHTML = modules.renderHTML;
  var responders = modules.responders;


  page.set(pageConfig);
  page.set({ message: message });
  (0, _tiskoLayout2.default)({ topNav: false }, page, { jsAsset: jsAsset });

  var html = renderHTML(page);

  responders.html(html);
};

exports.default = signUpController;
//# sourceMappingURL=controller.js.map
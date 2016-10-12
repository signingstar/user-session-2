"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

var _verify_password_token = require("../database/api/verify_password_token");

var _verify_password_token2 = _interopRequireDefault(_verify_password_token);

var _update_password = require("../database/api/update_password");

var _update_password2 = _interopRequireDefault(_update_password);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordResetController = function passwordResetController(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler;
  var logger = modules.logger;
  var jsAsset = modules.jsAsset;
  var cssAsset = modules.cssAsset;
  var queryDb = modules.queryDb;
  var Mailer = modules.Mailer;

  var title = 'Tisko - Password Rest';

  return {
    main: function main(_ref2) {
      var attributes = _ref2.attributes;
      var responders = _ref2.responders;
      var page = _ref2.page;
      var req = attributes.req;
      var res = attributes.res;
      var user = req.session.user;
      var token = req.params.token;

      var _layoutPresenter = (0, _tiskoLayout2.default)({ user: user, topNav: false }, page, { jsAsset: jsAsset });

      var _layoutPresenter$isLo = _layoutPresenter.isLogged;
      var isLogged = _layoutPresenter$isLo === undefined ? false : _layoutPresenter$isLo;


      if (isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      var srcPath = _path2.default.join(__dirname, '../../views/', 'password_reset');

      var renderHTML = pugCompiler(srcPath);

      (0, _verify_password_token2.default)([token], { logger: logger, queryDb: queryDb }, function (err, res) {
        page.set({
          javascript: jsAsset('sessionjs'),
          stylesheet: cssAsset('sessioncss'),
          body_class: 'password-reset',
          refUrl: "/password-reset/" + token,
          title: title,
          token: token
        });

        responders.html(renderHTML(page));
      });
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes;
      var responders = _ref3.responders;
      var page = _ref3.page;
      var req = attributes.req;
      var res = attributes.res;
      var session = req.session;
      var token = req.params.token;

      var refUrl = decodeURI(req.protocol + '://' + req.get('host'));

      var _req$body = req.body;
      var password = _req$body.password;
      var confirmpassword = _req$body.confirmpassword;

      var currentTimeUTC = new Date(Date.now()).toUTCString();

      _async2.default.waterfall([function (done) {
        (0, _update_password2.default)([token, password, currentTimeUTC], { logger: logger, queryDb: queryDb }, function (err, user) {
          done(err, user);
        });
      }, function (user, done) {
        var email = user.email;

        var mailOptions = {
          to: email,
          from: 'notify@tisko.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' + ("This is a confirmation that the password for your account " + email + " has just been changed.\n")
        };

        Mailer(mailOptions)(function (err, info) {
          if (err) {
            req.flash('An error occured whie resetting the password');
          } else {
            req.flash('success', 'Success! Your password has been changed.');
          }
          // done(err, 'done') Will commenting this result in any memory leak!!!!
          responders.redirectWithCookies('/login');
        });
      }], function (err) {
        responders.redirectWithCookies('/password-reset');
      });
    }
  };
};

exports.default = passwordResetController;
//# sourceMappingURL=controller.js.map
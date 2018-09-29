"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSendgridTransport = require("nodemailer-sendgrid-transport");

var _nodemailerSendgridTransport2 = _interopRequireDefault(_nodemailerSendgridTransport);

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _add_reset_token = require("../database/api/add_reset_token");

var _add_reset_token2 = _interopRequireDefault(_add_reset_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var forgotPasswordController = function forgotPasswordController(_ref) {
  var modules = _ref.modules;
  var pugCompiler = modules.pugCompiler,
      logger = modules.logger,
      jsAsset = modules.jsAsset,
      cssAsset = modules.cssAsset,
      queryDb = modules.queryDb,
      Mailer = modules.Mailer;


  var srcPath = _path2.default.join(__dirname, '../../views/', 'forgot_password');
  var renderHTML = pugCompiler(srcPath);
  var title = 'Tisko - Forgot Password';

  return {
    main: function main(_ref2) {
      var attributes = _ref2.attributes,
          responders = _ref2.responders,
          page = _ref2.page;
      var req = attributes.req,
          res = attributes.res;
      var user = req.session.user;

      var _layoutPresenter = (0, _tiskoLayout2.default)({ user: user, topNav: false }, page, { jsAsset: jsAsset }),
          _layoutPresenter$isLo = _layoutPresenter.isLogged,
          isLogged = _layoutPresenter$isLo === undefined ? false : _layoutPresenter$isLo;

      page.set({
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: title,
        body_class: 'forgot-password',
        refUrl: '/forgot-password'
      });

      responders.html(renderHTML(page));
    },

    post: function post(_ref3) {
      var attributes = _ref3.attributes,
          responders = _ref3.responders,
          page = _ref3.page;
      var req = attributes.req,
          res = attributes.res;
      var email = req.body.email;


      _async2.default.waterfall([function (done) {
        var tokenExpiry = Date.now() + 60 * 60 * 1000;
        var tokenExpiryUTC = new Date(tokenExpiry).toUTCString();

        (0, _add_reset_token2.default)([email, tokenExpiryUTC], { logger: logger, queryDb: queryDb }, function (err, result) {
          if (err) {
            logger.warn("no such user");
            // req.flash('error', 'No account with that email address exists.')
            return res.redirect('/forgot-password');
          }

          done(err, { email: email, token: result.token });
        });
      }, function (user, done) {
        var email = user.email,
            token = user.token;

        var mailOptions = {
          to: email,
          from: 'verify@tisko.com',
          subject: 'Tisko Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + ("http://" + req.headers.host + "/password-reset/" + token) + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        Mailer(mailOptions)(function (err, info) {
          if (err) {
            req.flash('An error occured whie sending the reset email');
          } else {
            req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          }
          done(err, 'done');
        });
      }], function (err) {
        if (err) return next(err);
        res.redirect('/forgot-password');
      });
    }
  };
};

exports.default = forgotPasswordController;
//# sourceMappingURL=controller.js.map
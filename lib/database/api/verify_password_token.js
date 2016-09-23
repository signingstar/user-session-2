"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _select = require("../sql_queries/select");

var verifyToken = function verifyToken(tokenData, modules, cb) {
  var queryDb = modules.queryDb;
  var logger = modules.logger;


  queryDb(_select.validatePasswordResetToken, tokenData, { logger: logger }, function (err, result) {
    if (err) {
      return cb(err, result);
    }

    var rows = result.rows;


    if (rows.length === 1 && rows[0].user_id) {
      logger.info("[DATABASE] TOKEN VERIFICATION successful for user: " + rows[0].user_id);
      cb(err, result.rows[0]);
    } else {
      var message = '[DATABASE] Unfortunately link has been expired. Please try resetting the password again';
      cb({ message: message });
    }
  });
};

exports.default = verifyToken;
//# sourceMappingURL=verify_password_token.js.map
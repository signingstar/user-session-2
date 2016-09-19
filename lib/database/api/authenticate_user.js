"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _select = require("../sql_queries/select");

var authenticateUser = function authenticateUser(loginData, modules, cb) {
  var queryDb = modules.queryDb;
  var logger = modules.logger;


  queryDb(_select.authenticateUserQuery, loginData, { logger: logger }, function (err, result) {
    if (err) {
      return cb(err, result);
    }

    var rows = result.rows;


    if (rows.length === 1) {
      logger.info("[LOGIN] successful for user: " + rows[0].email);
      cb(err, result.rows[0]);
    } else {
      var message = 'Invalid Username or Password';
      cb({ message: message });
    }
  });
};

exports.default = authenticateUser;
//# sourceMappingURL=authenticate_user.js.map
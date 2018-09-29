"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insert = require("../sql_queries/insert");

var authenticateUser = function authenticateUser(userData, modules, cb) {
  var queryDb = modules.queryDb,
      logger = modules.logger;

  var callback = cb;

  queryDb(_insert.addResetToken, userData, { logger: logger }, function (err, result) {
    if (err) {
      return callback(err, result);
    }

    var rows = result.rows;


    if (rows.length === 1 && rows[0].token) {
      logger.info("[DATABASE] RESET TOKEN added successfully for user: " + userData[0]);
      callback(err, rows[0]);
    } else {
      var message = '[DATABASE] User not found, who requested for password reset';
      callback({ message: message });
    }
  });
};

exports.default = authenticateUser;
//# sourceMappingURL=add_reset_token.js.map
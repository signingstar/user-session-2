"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update = require("../sql_queries/update");

var verifyToken = function verifyToken(passwordData, modules, cb) {
  var queryDb = modules.queryDb,
      logger = modules.logger;


  queryDb(_update.updatePassword, passwordData, { logger: logger }, function (err, result) {
    if (err) {
      return cb(err, result);
    }

    var rows = result.rows;


    if (rows.length === 1 && rows[0].email) {
      logger.info("[DATABASE] PASSWORD-RESET successful for user: " + rows[0].email);
      cb(err, rows[0]);
    } else {
      cb(err);
    }
  });
};

exports.default = verifyToken;
//# sourceMappingURL=update_password.js.map
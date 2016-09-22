"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insert = require("../sql_queries/insert");

var _select = require("../sql_queries/select");

var addUser = function addUser(signupData, modules, cb) {
  var queryDb = modules.queryDb;
  var logger = modules.logger;

  var callback = cb;

  queryDb(_insert.userEntryQuery, signupData, { logger: logger }, function (err, result) {
    if (err) {
      logger.error('[ERROR] Database', err);
      return callback(err);
    }

    var rows = result.rows;


    callback(err, result.rows[0]);
  });
};

exports.default = addUser;
//# sourceMappingURL=insert_user.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insert = require("../sql_queries/insert");

var addUser = function addUser(signupData, modules, cb) {
  var queryDb = modules.queryDb;
  var logger = modules.logger;


  queryDb(_insert.userEntryQuery, signupData, { logger: logger }, cb);
};

exports.default = addUser;
//# sourceMappingURL=insert_user.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var userEntryQuery = exports.userEntryQuery = "SELECT user_account.add_user($1, $2, $3, $4) AS user_id";

var addResetToken = exports.addResetToken = "SELECT user_account.password_reset_token($1, $2) AS token";
//# sourceMappingURL=insert.js.map
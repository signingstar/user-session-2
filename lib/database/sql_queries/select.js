"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var authenticateUserQuery = exports.authenticateUserQuery = "SELECT * FROM user_account.authenticate_user($1, $2)";

var validatePasswordResetToken = exports.validatePasswordResetToken = "SELECT * FROM user_account.tokens where token=$1";
//# sourceMappingURL=select.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
                                      value: true
});
var authenticateUserQuery = exports.authenticateUserQuery = "SELECT id, first_name, email FROM user_account.users\n                                      WHERE email = $1 AND\n                                      password = crypt($2, password)";

var fetchUser = exports.fetchUser = "SELECT id, first_name, email FROM user_account.users WHERE email = $1";
//# sourceMappingURL=select.js.map
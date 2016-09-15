'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');

var pathString = './config/user_info.json';

var readFileAsync = function readFileAsync(path, cb) {
  fs.readFile(path, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    cb(JSON.parse(data));
  });
};

var verifyUser = function verifyUser(userId, password, cb) {
  var validUser = false;

  readFileAsync(pathString, function (data) {
    var exactData = data[userId];
    if (exactData) {
      if (exactData.id === userId && password === exactData.password) {
        validUser = true;
      }
    }
    cb(validUser);
  });

  return validUser;
};

exports.default = verifyUser;
//# sourceMappingURL=verify_login.js.map
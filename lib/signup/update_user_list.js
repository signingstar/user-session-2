'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');

// var pathString = path.join(__dirname, './config', 'user_info.json');
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

var updateUserList = function updateUserList(_ref, callback) {
  var userid = _ref.userid;
  var userName = _ref.userName;
  var password = _ref.password;
  var telephone = _ref.telephone;

  var userExists = false;

  readFileAsync(pathString, function (data) {
    if (data[userid]) {
      callback(false);
    }

    data[userid] = {
      id: userid,
      password: password,
      phone: telephone,
      fullName: userName
    };

    fs.writeFile(pathString, JSON.stringify(data, null, 2), function () {
      callback(true);
    });
  });
};

exports.default = updateUserList;
//# sourceMappingURL=update_user_list.js.map
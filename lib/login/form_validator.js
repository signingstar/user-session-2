"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateForm = function validateForm(content) {
  var userid = content.userid,
      password = content.password;


  return { loginData: [userid, password] };
};

exports.default = validateForm;
//# sourceMappingURL=form_validator.js.map
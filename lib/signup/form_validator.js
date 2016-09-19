"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateForm = function validateForm(content) {
  var userid = content.userid;
  var fullname = content.fullname;
  var password = content.password;
  var telephone = content.telephone;
  var confirmpassword = content.confirmpassword;


  if (password !== confirmpassword) {
    return { err: "Passwords do not match" };
  }

  var formData = { userid: userid, fullname: fullname, password: password, telephone: telephone, confirmpassword: confirmpassword };

  return { formData: formData };
};

exports.default = validateForm;
//# sourceMappingURL=form_validator.js.map
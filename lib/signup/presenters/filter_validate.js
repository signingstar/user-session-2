"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _form_validator = require("./form_validator");

var _form_validator2 = _interopRequireDefault(_form_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterAndValidateFields = function filterAndValidateFields(bodyContent, cb) {
  var userid = bodyContent.userid;
  var fullname = bodyContent.fullname;
  var password = bodyContent.password;
  var telephone = bodyContent.telephone;
  var confirmpassword = bodyContent.confirmpassword;

  var _formValidator = (0, _form_validator2.default)({ userid: userid, fullname: fullname, password: password, telephone: telephone, confirmpassword: confirmpassword });

  var err = _formValidator.err;
  var formData = _formValidator.formData;


  if (err) {
    return { err: err };
  }

  var name = fullname.split(" ");
  var last_name = name.pop();
  var first_name = name.join(' ');

  return { signupData: [first_name, last_name, userid, password] };
};

exports.default = filterAndValidateFields;
//# sourceMappingURL=filter_validate.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tiskoLayout = require("tisko-layout");

var _tiskoLayout2 = _interopRequireDefault(_tiskoLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var respondError = function respondError(_ref, modules) {
  var err = _ref.err;
  var pageConfig = _ref.pageConfig;
  var jsAsset = modules.jsAsset;
  var page = modules.page;
  var renderHTML = modules.renderHTML;
  var responders = modules.responders;

  console.log("err:" + err);

  page.set(pageConfig);
  page.set({ message: err.detail || err.message });
  console.log("page:" + JSON.stringify(page));
  (0, _tiskoLayout2.default)({ topNav: false }, page, { jsAsset: jsAsset });

  responders.html(renderHTML(page));
};

exports.default = respondError;
//# sourceMappingURL=respond_error.js.map
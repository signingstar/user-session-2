import { pick } from "underscore";
import path from "path";

import { presenter } from "./presenter";
import verifyUser from "./verify_login";
import headerPresenter from "tisko-header";
let debug = require("debug")("Modules:loginController");

const loginController = function({modules}) {
  const {pugCompiler, logger, jsAsset, cssAsset} = modules;
  const title = 'Tisko - Login';
  const srcPath = path.join(__dirname, '../../views/', 'login');

  let fn = pugCompiler(srcPath);

  const pageConfig = {
    javascript: jsAsset('sessionjs'),
    stylesheet: cssAsset('sessioncss'),
    title,
    body_class: 'login'
  }

  return {
    get: function({attributes, responders, page}) {
      let {req, res} = attributes;
      let {cookies} = req;

      let {isLogged = false} = headerPresenter({cookies, topNav:false}, page);

      if(isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set( {
        refUrl: presenter(req.query.ref_url).uriWithRef
      })

      let html = fn(page);

      responders.html(html);
    },

    post: function({attributes, responders, page}) {
      let {req, res} = attributes;
      let {userid, password} = pick(req.body, (value, key) => key === 'userid' || key === 'password');

      verifyUser(userid, password, (isValid) => {
        if(isValid) {
          res.cookie('isLogged', true, {maxAge: 60*60*1000});
          const refUrl = presenter(req.query.ref_url, true).parsedUri;
          responders.redirectWithCookies(decodeURIComponent(refUrl));
        } else {
          headerPresenter({topNav:false}, page);

          page.set(pageConfig);
          page.set( {
            refUrl: presenter(req.query.ref_url).uriWithRef,
            message: 'Invalid login or password'
          })

          let html = fn(page);

          responders.html(html);
        }
      });
    }
  }
}

export default loginController;

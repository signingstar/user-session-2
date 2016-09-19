import { pick } from "underscore";
import path from "path";

import { presenter } from "./presenter";
import headerPresenter from "tisko-layout";
import authenticateUser from "../database/api/authenticate_user";
import formValidator from "./form_validator";
let debug = require("debug")("Modules:loginController");

const loginController = function({modules}) {
  const { pugCompiler, logger, jsAsset, cssAsset, queryDb } = modules;
  const title = 'Tisko - Login';
  const srcPath = path.join(__dirname, '../../views/', 'login');

  let renderHTML = pugCompiler(srcPath);

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

      let {isLogged = false} = headerPresenter({cookies, topNav:false}, page, {jsAsset})

      if(isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set( {
        refUrl: presenter(req.query.ref_url).uriWithRef
      })

      let html = renderHTML(page);

      responders.html(html);
    },

    post: function({attributes, responders, page}) {
      let {req, res} = attributes;
      let {userid, password} = pick(req.body, (value, key) => key === 'userid' || key === 'password');

      const { err, loginData } = formValidator({userid, password});

      if(err) {
        respondError({message: err.message, pageConfig},  { renderHTML, page, jsAsset, responders});
        return;
      }

      authenticateUser(loginData, { logger, queryDb }, (err, result) => {
        if(!err) {
          res.cookie('isLogged', true, {maxAge: 60*60*1000});
          const parsedRefUrl = presenter(req.query.ref_url, true).parsedUri;
          responders.redirectWithCookies(decodeURIComponent(parsedRefUrl));
        } else {
          respondError({message: err.message, pageConfig}, { renderHTML, page, jsAsset, responders} );
        }
      });
    }
  }
}

const respondError = ({message, pageConfig}, modules) => {
  const { jsAsset, page, renderHTML, responders } = modules;

  page.set(pageConfig);
  page.set({message});
  headerPresenter({topNav:false}, page, {jsAsset})

  const html = renderHTML(page);

  responders.html(html);
}


export default loginController;

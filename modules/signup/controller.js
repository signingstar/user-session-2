import { find, pick } from "underscore";
import path from "path";

import { presenter } from "./presenter";
import headerPresenter from "tisko-layout";
import AddUser from "../database/api/insert_user";
import formValidator from "./form_validator";

const signUpController = function({modules}) {
  const { pugCompiler, logger, jsAsset, cssAsset, queryDb } = modules;

  const srcPath = path.join(__dirname, '../../views/', 'signup');
  const renderHTML = pugCompiler(srcPath);
  const title = 'Tisko - Register';
  const pageConfig = {
    javascript: jsAsset('sessionjs'),
    stylesheet: cssAsset('sessioncss'),
    body_class: 'signup',
    title
  };

  return {
    get: function({attributes, responders, page}) {
      const {req, res} = attributes;
      const refUrl = presenter(req.query.ref_url).uriWithRef;
      const {cookies} = req;

      const {isLogged = false} = headerPresenter({cookies, topNav:false}, page, {jsAsset})

      if(isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({refUrl});

      let html = renderHTML(page);

      responders.html(html);
    },

    post: ({attributes, responders, page}) => {
      const {req, res} = attributes;
      const refUrl = req.query.ref_url ?  decodeURI(req.query.ref_url) : undefined;

      const { err, signupData } = filterAndValidateFields(req.body);

      if(err) {
        respondError({message: err.message, pageConfig},  { renderHTML, page, jsAsset, responders});
        return;
      }

      logger.info(`signupData:${signupData.join('<->')}`);

      AddUser(signupData, { logger, queryDb }, (err, result) => {
        if(!err) {
          res.cookie('isLogged', true, {maxAge: 60*60*1000});
          const parsedRefUrl = presenter(refUrl, true).parsedUri;
          responders.redirectWithCookies(parsedRefUrl);
        } else {
          respondError({message: err.message, pageConfig}, { renderHTML, page, jsAsset, responders} );
        }
      });
    }
  }
}

const filterAndValidateFields = (bodyContent, cb) => {
  const { userid, fullname, password, telephone, confirmpassword } = bodyContent;
  const {err, formData} = formValidator({ userid, fullname, password, telephone, confirmpassword });

  if(err) {
    return {err};
  }

  const name = fullname.split(" ");
  const last_name = name.pop();
  const first_name = name.join(' ');

  return { signupData: [first_name, last_name, userid, password] };
}

const respondError = ({message, pageConfig}, modules) => {
  const { jsAsset, page, renderHTML, responders } = modules;

  page.set(pageConfig);
  page.set({message});
  headerPresenter({topNav:false}, page, {jsAsset})

  const html = renderHTML(page);

  responders.html(html);
}

export default signUpController;

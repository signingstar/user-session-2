import { find, pick } from "underscore";
import path from "path";

import { presenter } from "./presenter";
import headerPresenter from "tisko-layout";
import updateUserList from "./update_user_list";

const signUpController = function({modules}) {
  const {pugCompiler, logger, jsAsset, cssAsset} = modules;
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

    post: function({attributes, responders, page}) {
      let {req, res} = attributes;
      let refUrl = decodeURI(req.query.ref_url);
      let validFields = ['userid', 'username', 'password', 'telephone']

      let signupData = pick(req.body, (value, key)=> {
        return find(validFields, (field) => field === key);
      });

      updateUserList(signupData, (state) => {
        if(state) {
          res.cookie('isLogged', true, {maxAge: 60*60*1000});
          refUrl = presenter(refUrl, true).parsedUri;
          responders.redirectWithCookies(refUrl);
        } else {
          page.set(pageConfig);
          page.set({message: 'Couldn\`t signed up', refUrl});

          let html = renderHTML(page);

          responders.html(html);
        }
      });
    }
  }
}

export default signUpController;

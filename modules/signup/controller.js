import { find, pick } from "underscore";
import path from "path";

import { presenter } from "./presenter";
import headerPresenter from "tisko-layout";
import updateUserList from "./update_user_list";

const signUpController = function({modules}) {
  let {pugCompiler, logger, jsAsset, cssAsset} = modules;

  return {
    get: function({attributes, responders, page}) {
      let {req, res} = attributes;
      const srcPath = path.join(__dirname, '../../views/', 'signup');
      let fn = pugCompiler(srcPath);
      let refUrl = presenter(req.query.ref_url).uriWithRef;
      let {cookies} = req;
      const title = 'Tisko - Register';

      let {isLogged = false} = headerPresenter({cookies, topNav:false}, page);

      if(isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set( {
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title,
        refUrl,
        body_class: 'signup'
      })

      let html = fn(page);

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
          let srcPath = path.join(__dirname, './', 'main');
          let fn = pugCompiler(srcPath);

          page.set( {
            javascript: jsAsset('sessionjs'),
            stylesheet: cssAsset('sessioncss'),
            title: 'Tisko - Register',
            refUrl,
            body_class: 'signup',
            message: 'Couldn\`t signed up'
          })

          let html = fn(page);

          responders.html(html);
        }
      });
    }
  }
}

export default signUpController;

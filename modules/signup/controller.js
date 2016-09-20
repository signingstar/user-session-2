import { find, pick } from "underscore";
import path from "path";

import { presenter } from "./presenters/presenter";
import filterAndValidate from "./presenters/filter_validate";
import layoutPresenter from "tisko-layout";
import addUser from "../database/api/insert_user";
import respondError from "../session/respond_error";

const controller = ({modules}) => {
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
    get: ({attributes, responders, page}) => {
      const {req, res} = attributes;
      const refUrl = presenter(req.query.ref_url).uriWithRef;
      const {session} = req;

      const {isLogged = false} = layoutPresenter({session, topNav:false}, page, {jsAsset})

      if(isLogged) {
        responders.redirectWithCookies("/");
        return;
      }

      page.set(pageConfig);
      page.set({refUrl});

      responders.html(renderHTML(page));
    },

    post: ({attributes, responders, page}) => {
      const {req, res} = attributes;
      const refUrl = req.query.ref_url ? decodeURI(req.query.ref_url) : undefined;

      const { err, signupData } = filterAndValidate(req.body);

      if(err) {
        respondError({err, pageConfig},  { renderHTML, page, jsAsset, responders});
        return;
      }

      addUser(signupData, { logger, queryDb }, (err, result) => {
        if(!err) {
          req.session.regenerate((err) => {
            req.session.user = result;
            res.cookie('fortune', result.id, {maxAge: 365*24*60*60*1000});
            const parsedRefUrl = presenter(refUrl, true).parsedUri;
            responders.redirectWithCookies(decodeURIComponent(parsedRefUrl));
          });
        } else {
          respondError({err, pageConfig}, { renderHTML, page, jsAsset, responders} );
        }
      });
    }
  }
}

export default controller;

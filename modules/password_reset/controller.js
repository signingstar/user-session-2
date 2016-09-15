import path from "path";

const passwordResetController = function({modules}) {
  let {pugCompiler, logger, jsAsset, cssAsset} = modules;

  return {
    main: function({attributes, responders, page}) {
      let {req, res} = attributes;
      const srcPath = path.join(__dirname, '../../views/', 'password_reset');
      let fn = pugCompiler(srcPath);

      page.set( {
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: 'Tisko - Password Reset',
        body_class: 'password-reset'
      })

      let html = fn(page);

      responders.html(html);
    },

    reset_password: function({attributes, responders, page}) {
      let {req, res} = attributes;
      let refUrl = decodeURI(req.protocol + '://' + req.get('host'));

      responders.redirectWithCookies(refUrl);

    }
  }
}

export default passwordResetController;

import headerPresenter from "tisko-layout";
import path from "path";

const signOutController = function({modules}) {
  const {pugCompiler, logger, jsAsset, cssAsset} = modules;
  const srcPath = path.join(__dirname, '../../views/', 'signout');
  const renderHTML = pugCompiler(srcPath);
  const title = 'Tisko - Logged out';

  return {
    main: function({attributes, responders, page}) {
      let {req, res} = attributes;

      res.clearCookie('wibele');

      req.session.destroy((err) => {
        logger.info('session destroyed');
      });

      headerPresenter({}, page, {jsAsset})

      page.set( {
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title,
        body_class: 'signout'
      })

      responders.html(renderHTML(page));
    }
  }
}

export default signOutController

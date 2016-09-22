import headerPresenter from "tisko-layout"
import path from "path"

const forgotPasswordController = function({modules}) {
  let {pugCompiler, logger, jsAsset, cssAsset} = modules

  return {
    main: function({attributes, responders, page}) {
      let {req, res} = attributes
      const srcPath = path.join(__dirname, '../../views/', 'forgot_password')
      let fn = pugCompiler(srcPath)

      headerPresenter({}, page, {jsAsset})

      page.set( {
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title: 'Tisko - password reset',
        body_class: 'forgot-password'
      })

      let html = fn(page)

      responders.html(html)
    }
  }
}

export default forgotPasswordController

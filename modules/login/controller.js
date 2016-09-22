import { pick } from "underscore"
import path from "path"

import { presenter } from "./presenter"
import layoutPresenter from "tisko-layout"
import authenticateUser from "../database/api/authenticate_user"
import formValidator from "./form_validator"
import respondError from "../session/respond_error"
let debug = require("debug")("Modules:loginController")

const controller = function({modules}) {
  const { pugCompiler, logger, jsAsset, cssAsset, queryDb } = modules
  const title = 'Tisko - Login'
  const srcPath = path.join(__dirname, '../../views/', 'login')

  let renderHTML = pugCompiler(srcPath)

  const pageConfig = {
    javascript: jsAsset('sessionjs'),
    stylesheet: cssAsset('sessioncss'),
    title,
    body_class: 'login'
  }

  return {
    get: function({attributes, responders, page}) {
      const {req, res} = attributes
      const {session} = req

      const {isLogged = false} = layoutPresenter({session, topNav:false}, page, {jsAsset})

      if(isLogged) {
        responders.redirectWithCookies("/")
        return
      }

      page.set(pageConfig)
      page.set( {
        refUrl: presenter(req.query.ref_url).uriWithRef
      })

      responders.html(renderHTML(page))
    },

    post: function({attributes, responders, page}) {
      const {req, res} = attributes
      let {userid, password} = pick(req.body, (value, key) => key === 'userid' || key === 'password')

      const { err, loginData } = formValidator({userid, password})

      if(err) {
        respondError({err, pageConfig},  { renderHTML, page, jsAsset, responders})
        return
      }

      authenticateUser(loginData, { logger, queryDb }, (err, result) => {
        if(!err) {
          logger.info(`LOGIN successful for user: ${loginData[0]}`)

          req.session.regenerate((err) => {
            req.session.user = result
            res.cookie('fortune', result.id, {maxAge: 365*24*60*60*1000})
            const parsedRefUrl = presenter(req.query.ref_url, true).parsedUri
            responders.redirectWithCookies(decodeURIComponent(parsedRefUrl))
          })
        } else {
          respondError({err, pageConfig}, { renderHTML, page, jsAsset, responders} )
        }
      })
    }
  }
}

export default controller

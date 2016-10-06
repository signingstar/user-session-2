import async from "async"
import path from "path"
import layoutPresenter from "tisko-layout"

import verifyToken from "../database/api/verify_password_token"
import resetPassword from "../database/api/update_password"

const passwordResetController = function({modules}) {
  const { pugCompiler, logger, jsAsset, cssAsset, queryDb, Mailer } = modules
  const title = 'Tisko - Password Rest'

  return {
    main: function({attributes, responders, page}) {
      const {req, res} = attributes
      const {session, params: {token}} = req

      const {isLogged = false} = layoutPresenter({session, topNav:false}, page, {jsAsset})

      if(isLogged) {
        responders.redirectWithCookies("/")
        return
      }

      const srcPath = path.join(__dirname, '../../views/', 'password_reset')

      let renderHTML = pugCompiler(srcPath)

      verifyToken([token], {logger, queryDb}, (err, res) => {
        page.set( {
          javascript: jsAsset('sessionjs'),
          stylesheet: cssAsset('sessioncss'),
          body_class: 'password-reset',
          refUrl: `/password-reset/${token}`,
          title,
          token
        })

        responders.html(renderHTML(page))
      });

    },

    post: function({attributes, responders, page}) {
      const {req, res} = attributes
      const {session, params: {token}} = req
      const refUrl = decodeURI(req.protocol + '://' + req.get('host'))

      const { password, confirmpassword } = req.body;
      const currentTimeUTC = new Date(Date.now()).toUTCString()

      async.waterfall(
        [
          (done) => {
            resetPassword([token, password, currentTimeUTC], {logger, queryDb}, (err, user) => {
              done(err, user)
            })
          },
          (user, done) => {
            const {email} = user
            const mailOptions = {
              to: email,
              from: 'notify@tisko.com',
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                      `This is a confirmation that the password for your account ${email} has just been changed.\n`
            }

            Mailer(mailOptions)((err, info) => {
              if(err) {
                req.flash('An error occured whie resetting the password')
              } else {
                req.flash('success', 'Success! Your password has been changed.')
              }
              // done(err, 'done') Will commenting this result in any memory leak!!!!
              responders.redirectWithCookies('/login')
            })
          }
        ], (err) => {
          responders.redirectWithCookies('/password-reset')
        }
      )
    }
  }
}

export default passwordResetController

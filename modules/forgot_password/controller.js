import async from "async"
import nodemailer from "nodemailer"
import sgTransport from "nodemailer-sendgrid-transport"
import layoutPresenter from "tisko-layout"
import path from "path"

import addResetToken from "../database/api/add_reset_token"

const forgotPasswordController = function({modules}) {
  const { pugCompiler, logger, jsAsset, cssAsset, queryDb, Mailer } = modules

  const srcPath = path.join(__dirname, '../../views/', 'forgot_password')
  const renderHTML = pugCompiler(srcPath)
  const title = 'Tisko - Forgot Password'

  return {
    main: function({attributes, responders, page}) {
      const {req, res} = attributes
      const {session: {user}} = req

      const {isLogged = false} = layoutPresenter({user, topNav:false}, page, {jsAsset})

      page.set( {
        javascript: jsAsset('sessionjs'),
        stylesheet: cssAsset('sessioncss'),
        title,
        body_class: 'forgot-password',
        refUrl: '/forgot-password'
      })

      responders.html(renderHTML(page))
    },

    post: ({attributes, responders, page}) => {
      const {req, res} = attributes
      const {email} = req.body

      async.waterfall(
        [
          (done) => {
            let tokenExpiry = Date.now() + 60 * 60 * 1000
            let tokenExpiryUTC = new Date(tokenExpiry).toUTCString()

            addResetToken([email, tokenExpiryUTC], { logger, queryDb }, (err, result) => {
              if (err) {
                logger.warn(`no such user`)
                // req.flash('error', 'No account with that email address exists.')
                return res.redirect('/forgot-password')
              }

              done(err, {email: email, token: result.token})
            })
          },
          (user, done) => {
            const {email, token} = user
            var mailOptions = {
              to: email,
              from: 'verify@tisko.com',
              subject: 'Tisko Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        `http://${req.headers.host}/password-reset/${token}` + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }

            Mailer(mailOptions)((err, info) => {
              if(err) {
                req.flash('An error occured whie sending the reset email')
              } else {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.')
              }
              done(err, 'done')
            })
          }
        ], (err) => {
          if (err) return next(err)
          res.redirect('/forgot-password')
        }
      )
    }
  }
}

export default forgotPasswordController

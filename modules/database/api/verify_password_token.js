import { validatePasswordResetToken } from "../sql_queries/select"

const verifyToken = (tokenData, modules, cb) => {
  const { queryDb, logger } = modules

  queryDb(validatePasswordResetToken, tokenData, { logger}, (err, result) => {
    if(err) {
      return cb(err, result)
    }

    const { rows } = result

    if(rows.length === 1 && rows[0].user_id) {
      logger.info(`[DATABASE] TOKEN VERIFICATION successful for user: ${rows[0].user_id}`)
      cb(err, result.rows[0])
    } else {
      const message = '[DATABASE] Unfortunately link has been expired. Please try resetting the password again'
      cb({message})
    }
  })
}

export default verifyToken

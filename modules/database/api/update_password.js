import { updatePassword } from "../sql_queries/update"

const verifyToken = (passwordData, modules, cb) => {
  const { queryDb, logger } = modules

  queryDb(updatePassword, passwordData, { logger}, (err, result) => {
    if(err) {
      return cb(err, result)
    }

    const { rows } = result

    if(rows.length === 1 && rows[0].email) {
      logger.info(`[DATABASE] PASSWORD-RESET successful for user: ${rows[0].email}`)
      cb(err, rows[0])
    } else {
      cb(err)
    }
  })
}

export default verifyToken

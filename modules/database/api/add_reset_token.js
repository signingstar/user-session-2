import { addResetToken } from "../sql_queries/insert"

const authenticateUser = (userData, modules, cb) => {
  const { queryDb, logger } = modules
  const callback = cb;

  queryDb(addResetToken, userData, { logger}, (err, result) => {
    if(err) {
      return callback(err, result)
    }

    const { rows } = result

    if(rows.length === 1 && rows[0].token ) {
      logger.info(`[DATABASE] RESET TOKEN added successfully for user: ${userData[0]}`)
      callback(err, rows[0])
    } else {
      const message = '[DATABASE] User not found, who requested for password reset'
      callback({message})
    }
  })
}

export default authenticateUser

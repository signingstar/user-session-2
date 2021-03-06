import { authenticateUserQuery } from "../sql_queries/select"

const authenticateUser = (loginData, modules, cb) => {
  const { queryDb, logger } = modules

  queryDb(authenticateUserQuery, loginData, { logger}, (err, result) => {
    if(err) {
      return cb(err, result)
    }

    const { rows } = result

    if(rows.length === 1 && rows[0].id) {
      logger.info(`[DATABASE] LOGIN successful for user: ${rows[0].email}`)
      cb(err, result.rows[0])
    } else {
      const message = '[DATABASE] Invalid Username or Password'
      cb({message})
    }
  })
}

export default authenticateUser

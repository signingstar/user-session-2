import { userEntryQuery } from "../sql_queries/insert"
import { fetchUser } from "../sql_queries/select"

const addUser = (signupData, modules, cb) => {
  const { queryDb, logger } = modules
  const callback = cb

  queryDb(userEntryQuery, signupData, {logger}, (err, result) => {
    if(err) {
      logger.error('[ERROR] Database', err)
      return callback(err)
    }

    const { rows } = result

    if(rows.length === 1 && rows[0].user_id) {
      callback(err, result.rows[0])
    } else {
      const message = '[DATABASE] Error Signing up user'
      callback({message})
    }
  })
}

export default addUser

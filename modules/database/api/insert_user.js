import { userEntryQuery } from "../sql_queries/insert";
import { fetchUser } from "../sql_queries/select";

const addUser = (signupData, modules, cb) => {
  const { queryDb, logger } = modules;
  const callback = cb;
  queryDb(userEntryQuery, signupData, {logger}, (err, result) => {
    if(err) {
      logger.error('[ERROR] Database', err);
      return callback(err);
    }

    queryDb(fetchUser, [signupData[2]], { logger}, (err, result) => {
      if(err) {
        return callback(err, result);
      }

      const { rows } = result;
      logger.info(`[LOGIN] successful for user: ${rows[0].email}`);

      callback(err, result.rows[0]);
    });
  });
}

export default addUser;

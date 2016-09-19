import { userEntryQuery } from "../sql_queries/insert";

const addUser = (signupData, modules, cb) => {
  const { queryDb, logger } = modules;

  queryDb(userEntryQuery, signupData, {logger}, cb);
}

export default addUser

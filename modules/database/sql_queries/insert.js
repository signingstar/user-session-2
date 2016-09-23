export const userEntryQuery = `SELECT user_account.add_user($1, $2, $3, $4) AS user_id`

export const addResetToken = `SELECT user_account.password_reset_token($1, $2) AS token`;

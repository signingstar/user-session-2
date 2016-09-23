export const authenticateUserQuery = `SELECT * FROM user_account.authenticate_user($1, $2)`

export const validatePasswordResetToken = `SELECT * FROM user_account.tokens where token=$1`

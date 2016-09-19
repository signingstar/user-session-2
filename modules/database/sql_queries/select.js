export const authenticateUserQuery = `SELECT id, first_name, email FROM user_account.users
                                WHERE email = $1 AND
                                password = crypt($2, password)`;

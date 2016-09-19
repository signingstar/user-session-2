
export const userEntryQuery = `INSERT into user_account.users (first_name, last_name, email, password) VALUES($1, $2, $3, crypt($4, gen_salt('bf',8)));`;

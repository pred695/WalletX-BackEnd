module.exports.fetch = 'SELECT * FROM users';
module.exports.search = 'SELECT * FROM users WHERE username = $1';
module.exports.searchById = 'SELECT * FROM users WHERE user_id = $1';
module.exports.signUp = 'INSERT INTO users (username, email, password, watchlist_items) VALUES ($1, $2, $3, $4) RETURNING *';
module.exports.searchAsset = 'SELECT * FROM watchlist WHERE asset_id = $1';
module.exports.searchUser = 'SELECT * FROM watchlist WHERE username = $1';
module.exports.searchData = 'SELECT * FROM watchlist WHERE asset_id = $1 AND username = $2';
module.exports.insertData = 'INSERT INTO watchlist (username, asset_id, asset_name, asset_info) VALUES ($1, $2, $3, $4) RETURNING *';
module.exports.fetchWatchList = 'SELECT * FROM watchlist WHERE username = $1';
module.exports.removeAsset = 'DELETE FROM watchlist WHERE asset_id = $1 AND username = $2';
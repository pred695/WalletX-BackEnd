const pool = require('../Config');
const queries = require('../Queries/itemQueries');
const UserQueries = require('../Queries/itemQueries');
const AssetLink = require('../Database/links');
const jwt = require('jsonwebtoken');

module.exports.addToWatchList = async (req, resp) => {
    try{
        const {asset_name, asset_id} = req.body;
        const asset_info = AssetLink.links[asset_id];
        const token = req.cookies.jwt;
        if(!token){
            return resp.status(401).json({message: 'Unauthorized'});
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user_id = decodedToken.id;
        let result = await pool.query(UserQueries.searchById, [user_id]);
        const username = result.rows[0].username;//result.rows[0] = user's object
        result = await pool.query(queries.searchData, [asset_id, username]);
        if(result.rows.length === 0){
            result = await pool.query(queries.insertData, [username, asset_id, asset_name, asset_info]);
            console.log(result.rows[0]);
            return resp.status(201).json({message: 'Added to watchlist'});
        }else{
            return resp.status(400).json({message: 'Already added to watchlist'});
        }
    }catch(err){
        console.error(err);
        resp.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports.fetchWatchList = async(req, resp) => {
    try{
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user_id = decodedToken.id;
        let result = await pool.query(UserQueries.searchById, [user_id]);
        const username = result.rows[0].username;//result.rows[0] = user's object
        result = await pool.query(queries.fetchWatchList, [username]);
        return resp.status(200).json({watchlist: result.rows});
    }catch(err){
        console.error(err);
        resp.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports.removeAsset = async(req, resp) => {
    try{
        const {asset_id} = req.params;
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user_id = decodedToken.id;
        let result = await pool.query(UserQueries.searchById, [user_id]);
        const username = result.rows[0].username;//result.rows[0] = user's object
        //if the remove button is clicked, it means the user has that specific asset, so no need to search for the asset and the user in the watchlist table.
        result = await pool.query(queries.removeAsset, [asset_id, username]);
        return resp.status(200).json({message: 'Asset removed'});
    }catch(err){
        console.error(err);
        resp.status(500).json({message: 'Internal Server Error'});
    }
}
const jwt = require('jsonwebtoken');
const pool = require('../Config');
const queries = require('../Queries/userQueries');


// Middleware to verify the user, used in protected
module.exports.verifyUser = (req, resp, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
                async (err, decodedToken) => {
                    if (err) {
                        console.error(err);
                        resp.status(401).json({ message: 'Unauthorized' });
                    } else {
                        const user_id = decodedToken.id;
                        let result = await pool.query(queries.searchById, [user_id]);
                        const user = result.rows[0];
                        resp.locals.user = user;
                        next();
                    }
                }
            )
        } else {
            resp.status(401).json({ message: 'Unauthorized' }); // Return an unauthorized response
        }
    } catch (err) {
        console.error(err);
        resp.status(500).json({ message: 'Internal Server Error' });
    }
};

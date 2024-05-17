const pool = require('../Config');
const queries = require('../Queries/userQueries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const handleSignUpError = (err) => {
    let errors = { username: '', email: '', password: '' };
    if (err.constraint === 'users_email_key') {
        errors.email = 'Email already registered';
    } else if (err.message === 'Password length must be greater than 6') {
        errors.password = err.message;
    } else if (err.constraint === 'users_username_key') {
        errors.username = 'Username already taken';
    } else if (err.message === 'Invalid email format') {
        errors.email = 'Enter a valid email';
    }
    return errors;  //otherwise throw other unhandled errors.
}

const handleLogInError = (err) => {
    let errors = { username: '', password: '' };
    if (err.message === 'User not found') {
        errors.username = err.message;
    } else if (err.message === 'Invalid password') {
        errors.password = err.message;
    }
    return errors;
}

const maxAge = 86400; // 3 days in seconds
const createToken = (id) => {
    return jwt.sign(
        { id: id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: maxAge, }
    );
};

module.exports.fetch = async (req, resp) => {
    try {
        let result = await pool.query(queries.fetch);
        resp.json(result.rows);
    } catch (err) {
        console.error(err);
        resp.status(500).json({ message: 'Internal Server Error' });
    };
};

module.exports.search = async (req, resp) => {
    try {
        const { username } = req.params;
        let result = await pool.query(queries.search, [username]);
        if (result.rows.length > 0) {
            resp.json(result.rows);
        } else {
            return resp.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        resp.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

module.exports.signUp = async (req, resp) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists by username
        let result = await pool.query(queries.search, [username]);
        // Check password length
        if (password.length < 6) {
            throw new Error('Password length must be greater than 6');
        }
        //check if the email entered is valid or not:
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        // Hash the password using bcrypt + salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Insert the new user
        result = await pool.query(queries.signUp, [username, email, hashedPassword, watchlist_items]);
        //User inserted, now jwt token generation
        resp.json({ message: 'User signed up successfully', newUser: result.rows[0] });
    } catch (err) {
        const errors = handleSignUpError(err);
        resp.status(500).send({ errors });
    }
};

module.exports.logIn = async (req, resp) => {
    try {
        const { username, password } = req.body;
        let result = await pool.query(queries.search, [username]);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        } else {
            const user = result.rows[0];
            //compare the hashed password
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                //generate jwt token
                const token = createToken(user.user_id);
                resp.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000,
                    secure: true, // set to true if your using https`
                    sameSite: "none",
                });// Set the cookie
                resp.status(200).json({ message: 'User logged in successfully' });
            } else {
                throw new Error('Invalid password');
            }
        }
    } catch (err) {
        const errors = handleLogInError(err);
        resp.status(401).json({ errors });
    }
};

module.exports.logOut = (req, resp) => {
    resp.cookie('jwt', "", {
        httpOnly: true,
        maxAge: -1,
        secure: true, // set to true if your using https`
        sameSite: "none",
    });   //negative maxAge so that the cookie expires immediately
    resp.send('User logged out successfully')
};
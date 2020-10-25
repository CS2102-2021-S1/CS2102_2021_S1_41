const njwt = require('njwt');
const crypto = require('crypto');
const { access } = require('fs');

APP_SECRET = '33FIICwOlKEg5M4D'

const encodeToken = (tokenData) => {
  return njwt.create(tokenData, APP_SECRET).compact();
}
exports.encodeToken = encodeToken;

const decodeToken = (token) => {
  return njwt.verify(token, APP_SECRET).body;
}
exports.decodeToken = decodeToken;

const auth = (db) =>	{
	// This express middleware attaches `username` to the `req` object if a user is
	// authenticated. This middleware expects a JWT token to be stored in the
	// `Access-Token` header.
	const jwtAuthenticationMiddleware = (req, res, next) => {
		const token = req.header('Access-Token');
		if (!token) {
			return next();
		}

		try {
			const decoded = decodeToken(token);
			const { username } = decoded;
			
			//Search for the username
			//Set the authenticated username in the req header
			db.query('SELECT * FROM usernames WHERE username = $1', [username], (error, results) =>	{
				if (!error)	{
					if (results.rows.length == 1)	{
						req.username = username;
					}
				}
			});
		} catch (e) {
			return next();
		}

			next();
	};

	// This middleware stops the request if a user is not authenticated.
	async function isAuthenticatedMiddleware(req, res, next) {
		if (req.username) {
			return next();
		}

		res.status(401);
		res.json({ error: 'User not authenticated' });
	}

	// This endpoints generates and returns a JWT access token given authentication
	// data.
	async function jwtLogin(req, res) {
		const { username, password } = req.body;

		db.query('SELECT * FROM users WHERE username = $1', [username], (error, results) =>	{
			if (!error)	{
				if (results.rows.length == 1)	{
					const salt = results.rows[0].salt;
					const hash = crypto.createHash('sha256').update(salt + password).digest('base64');
					if (hash === results.rows[0].password_hash)	{
						const accessToken = encodeToken({ username: username });
						return res.json({ status: "Success", displayName: results.rows[0].display_name, accessToken });
					}
					else	{
						return res.json({ status: 'Invalid login' });
					}
				}
				else	{
					return res.json({ status: 'Invalid login' });
				}
			}
			else	{
				console.log(error);
				return res.json({ status: 'Internal Server Error. Please try again later.' });
			}
		});

		
	}

	return [jwtAuthenticationMiddleware, isAuthenticatedMiddleware, jwtLogin];
}

exports.auth = auth;
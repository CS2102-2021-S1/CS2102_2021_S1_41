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
	const jwtAuthenticationMiddleware = async (req, res, next) => {
		const token = req.header('Access-Token');
		if (!token) {
			return next();
		}

		try {
			const decoded = decodeToken(token);
			const { username } = decoded;
			
			let user = { username: "", isPetOwner: false, isCareTaker: false, isAdmin: false }
			let res = await db.query('SELECT * FROM pet_owners WHERE username = $1', [username]);
			if (res.rows.length == 1)
				user.isPetOwner = true;
			res = await db.query('SELECT * FROM care_takers WHERE username = $1', [username]);
			if (res.rows.length == 1)
				user.isCareTaker = true;
			res = await db.query('SELECT * FROM pcs_administrators WHERE username = $1', [username]);
			if (res.rows.length == 1)
				user.isAdmin = true;
			res = await db.query('SELECT * FROM users WHERE username = $1', [username]);
			if (res.rows.length == 1)	{
				user.username = username;
				req.user = user;
			}
		} catch (e) {
			return next();
		}
		next();
	};

	// This middleware stops the request if a user is not authenticated.
	async function isAuthenticatedMiddleware(req, res, next) {
		if (req.user) {
			return next();
		}

		res.status(401);
		res.json({ error: 'User not authenticated' });
	}

	// This endpoints generates and returns a JWT access token given authentication
	// data.
	async function jwtLogin(req, res) {
		const { username, password } = req.body;

		db.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) =>	{
			if (!error)	{
				if (results.rows.length == 1)	{
					const salt = results.rows[0].salt;
					const hash = crypto.createHash('sha256').update(salt + password).digest('base64');
					if (hash === results.rows[0].password_hash)	{
						const accessToken = encodeToken({ username: username });
						let isPetOwner = false;
						let isCareTaker = false;
						let isAdmin = false;

						try	{
							const res = await db.query('SELECT * FROM pet_owners WHERE username = $1', [username]);
							if (res.rows.length == 1)
								isPetOwner = true;
						} catch (err) {
							console.log(err);
						}

						try	{
							const res = await db.query('SELECT * FROM care_takers WHERE username = $1', [username]);
							if (res.rows.length == 1)
								isCareTaker = true;
						} catch (err) {
							console.log(err);
						}

						try	{
							const res = await db.query('SELECT * FROM pcs_administrators WHERE username = $1', [username]);
							if (res.rows.length == 1)
								isAdmin = true;
						} catch (err) {
							console.log(err);
						}

						return res.json({ status: "Success", displayName: results.rows[0].display_name, accessToken, isPetOwner, isCareTaker, isAdmin });
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
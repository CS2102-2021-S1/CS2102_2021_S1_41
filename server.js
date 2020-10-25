// Node-postgres guide: https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/
const http = require('http');
const express  = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const { Client } = require('pg');
const crypto = require('crypto');
const path = require('path');
const auth = require(path.resolve(__dirname, "./auth.js"));
const db = new Client({
	user: 'postgres',
	host: 'petcare.places.sg',
	database: 'petcare',
	password: 'CS2102',
	port: 5432,
});

db.connect();
console.log("Connected to the database.");

const [jwtAuthenticationMiddleware, isAuthenticatedMiddleware, jwtLogin] = auth.auth(db);


const argv = yargs(process.argv).argv;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(jwtAuthenticationMiddleware);
const server = http.createServer(app);
const port = argv.port || 8080;

app.post("/register", (req, res) =>	{
	const salt = crypto.randomBytes(12).toString('base64');
	const hash = crypto.createHash('sha256').update(salt + req.body.password).digest('base64');
	db.query('INSERT INTO users(username, display_name, password_hash, salt) VALUES ($1, $2, $3, $4)', 
	[req.body.username, req.body.display_name, hash, salt], (error, results) =>	{
		if (!error)	{
			db.query('INSERT INTO pet_owners(username) VALUES ($1)', 
				[req.body.username], (error, results) =>	{
					if (!error)
						res.send({status: 'registered'});
					else
						res.send({status: 'failed'});
				});
		}
		else
			res.send({status: 'failed'});
	});
});

app.post("/login", jwtLogin);

//Use isAuthenticationMiddleware to check if user is logged in (Server side check)
app.get("/getPets", isAuthenticatedMiddleware, (req, res) =>	{
	console.log(req.user);
});

server.listen(port, () =>
	console.log(`Backend server started on port ${port}`)
);

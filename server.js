// Node-postgres guide: https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/
const http = require('http');
const express  = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const { Client } = require('pg');
const crypto = require('crypto');

const db = new Client({
	user: 'postgres',
	host: 'petcare.places.sg',
	database: 'petcare',
	password: 'CS2102',
	port: 5432,
});

db.connect();
console.log("Connected to the database.");

var careTakerRouter = require('./routes/caretakers');

const argv = yargs(process.argv).argv;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/caretakers', careTakerRouter);
const server = http.createServer(app);
const port = argv.port || 8080;

app.post("/register", (req, res) =>	{
	const salt = crypto.randomBytes(12).toString('base64');
	const hash = crypto.createHash('sha256').update(salt + req.body.password).digest('base64');
	db.query('INSERT INTO users(username, display_name, password_hash, salt) VALUES ($1, $2, $3, $4)', 
	[req.body.username, req.body.display_name, hash, salt], (error, results) =>	{
		if (!error)
			res.send({status: 'registered'});
		else
			res.send({status: 'failed'});
	});
});

server.listen(port, () =>
	console.log(`Backend server started on port ${port}`)
);

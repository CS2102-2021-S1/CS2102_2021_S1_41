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

app.get("/caretakers", (req, res) =>	{
	const qstring = "SELECT a.care_taker, employee_type, pet_type, price, area, start_date, end_date\n" +
        "FROM availabilities a\n" +
        "LEFT JOIN care_takers c ON a.care_taker = c.username\n" +
        "LEFT JOIN prices p ON a.care_taker = p.care_taker;";
    db.query(qstring, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.send(JSON.stringify(result.rows));
    });
});

//Use isAuthenticationMiddleware to check if user is logged in (Server side check)
app.get("/getOwnerPets", isAuthenticatedMiddleware, (req, res) =>	{
	//console.log(req.user);
	db.query('SELECT pet_name, pet_type FROM pets WHERE username = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack)
		} else {
			//console.log(res.rows[0])
			res.send(dbres.rows);
		}
	});
});

app.get("/getBasePrices", isAuthenticatedMiddleware, (req, res) =>	{
	//console.log(req.user);
	if(!req.user.isAdmin) {
        res.send({status: 'not admin'});
        return;
    }
	db.query('SELECT pet_type, price FROM base_prices', (err, dbres) => {
		if (err) {
		  	console.log(err.stack);
		} else {
			res.send(dbres.rows);
		}
	});
});

app.post("/addPet", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('INSERT INTO pets(username, pet_name, pet_type, special_req) VALUES ($1, $2, $3, $4)', 
	[req.user.username, req.body.pet_name, req.body.pet_type, req.body.special_req], (error, results) =>	{
		if (!error)	{
			res.send({status: 'success'});
		}
		else
			res.send({status: 'failed'});
	});
});

app.post("/deletePet", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('DELETE FROM pets WHERE username = $1 and pet_name = $2', 
	[req.user.username, req.body.pet_name], (error, results) =>	{
		if (!error)	{
			res.send({status: 'success'});
		}
		else
			res.send({status: 'failed'});
	});
});

app.post("/addBasePrice", isAuthenticatedMiddleware, (req, res) =>	{
    console.log(req.user);
    if(!req.user.isAdmin){
        res.send({status: 'not admin'});
        return;
    }
	db.query('INSERT INTO base_prices(pet_type, price) VALUES ($1, $2)',
	[req.body.base_price_pet_type, req.body.base_price_price], (error, results) =>	{
		if (!error)	{
			res.send({status: 'success'});
		}
		else
			res.send({status: 'failed'});
	});
});

app.post("/deleteBasePrice", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isAdmin){
        res.send({status: 'not admin'});
        return;
    }
	db.query('DELETE FROM base_prices WHERE pet_type = $1',
	[req.body.pet_type], (error, results) =>	{
		if (!error)	{
			res.send({status: 'success'});
		}
		else
			res.send({status: 'failed'});
	});
});

server.listen(port, () =>
	console.log(`Backend server started on port ${port}`)
);

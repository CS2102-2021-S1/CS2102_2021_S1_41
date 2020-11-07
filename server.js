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
	database: 'petcarev2',
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
	const qstring = "SELECT a.care_taker, employee_type, pet_type, price, area,\n" +
	    "TO_CHAR(start_date, 'DD-MON-YYYY') AS start_date, TO_CHAR(end_date, 'DD-MON-YYYY') AS end_date\n" +
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

//Gihun
//30-10-2020
//retrieving average price for each pet type and area
app.get("/getAveragePrice", (req, res) => {
    const qstring = "SELECT a.pet_type, area, average_price, price AS base_price, \n" +
    "CASE WHEN price <= average_price THEN 1 ELSE 0 END AS ishigh\n" + 
    "FROM base_prices b LEFT JOIN\n" +
    "(SELECT pet_type AS pet_type, area, ROUND(AVG(p.price)::NUMERIC,2) AS average_price\n" +
    "FROM prices p, care_takers c\n" +
    "GROUP BY pet_type, area) a ON a.pet_type = b.pet_type;";
    db.query(qstring, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.send(JSON.stringify(result.rows));
    });
});

//retrieving unique areas in all care_takers available
app.get("/getAreas", (req, res) => {
	const qstring = "SELECT DISTINCT area FROM care_takers;";
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

app.get("/getOwnerBids", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('SELECT * FROM bids WHERE pet_owner = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack)
		} else {
			res.send(dbres.rows);
		}
	});
});

app.get("/getCaretakerBids", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('SELECT * FROM bids WHERE care_taker = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack)
		} else {
			res.send(dbres.rows);
		}
	});
});

app.get("/getUsers", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isAdmin){
        res.send({status: 'not admin'});
        return;
    }
	db.query(`SELECT users.username, users.display_name, pet_owners.username as is_owner, care_takers.username as is_care_taker, pcs_administrators.username as is_admin FROM 
	users left join pcs_administrators on users.username = pcs_administrators.username
	left join pet_owners on users.username = pet_owners.username
	left join care_takers on users.username = care_takers.username`, (err, dbres) => {
		if (err) {
		  	console.log(err.stack)
		} else {
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

app.post("/editBasePrice", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isAdmin){
        res.send({status: 'not admin'});
        return;
	}
	let good_price = parseFloat(req.body.new_price) * 1.2;
	good_price = good_price.toString();
	db.query('UPDATE base_prices SET price = $1 WHERE pet_type = $2',
	[req.body.new_price, req.body.pet_type], (error, results) =>	{
		if (!error)	{
			db.query('UPDATE prices SET price = $1 WHERE pet_type = $2 AND price < $3',
			[req.body.new_price, req.body.pet_type, req.body.new_price], (error, results) =>	{
			if (!error)	{
				db.query(`UPDATE prices
				SET price = $1
				WHERE pet_type = $2 AND care_taker in (
				SELECT username FROM care_takers join prices on care_takers.username = prices.care_taker
				WHERE care_takers.employee_type = 'full-time' and pet_type = $3 and avg_rating>=4
				  )`,
				[good_price, req.body.pet_type, req.body.pet_type], (error, results) =>	{
				if (!error)	{
					db.query(`UPDATE prices
					SET price = $1
					WHERE pet_type = $2 AND care_taker in (
					SELECT username FROM care_takers join prices on care_takers.username = prices.care_taker
					WHERE care_takers.employee_type = 'full-time' and pet_type = $3 and (avg_rating<4 or avg_rating IS NULL)
					)`,
					[req.body.new_price, req.body.pet_type, req.body.pet_type], (error, results) =>	{
					if (!error)	{
						res.send({status: 'success'});
					}
					else
						res.send({status: 'failed'});
					});
				}
				else
					res.send({status: 'failed'});
				});
			}
			else
				res.send({status: 'failed'});
			});
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

app.post("/toggleAccType", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isAdmin){
        res.send({status: 'not admin'});
        return;
	}
	let table = 'pcs_administrators';
	if (req.body.type === 'owner')
		table = 'pet_owners';
	else if (req.body.type === 'care_taker')
		table = 'care_takers';

	if (req.body.insert)	{
		db.query('INSERT INTO ' + table + ' (username) VALUES ($1)',
		[req.body.username], (error, results) =>	{
			if (!error)	{
				res.send({status: 'success'});
			}
			else
				res.send({status: 'failed'});
		});
	}
	//Delete
	else	{
		db.query('DELETE FROM ' + table + ' WHERE username = $1',
		[req.body.username], (error, results) =>	{
			if (!error)	{
				res.send({status: 'success'});
			}
			else
				res.send({status: 'failed'});
		});
	}
});

app.get("/getPriceList", isAuthenticatedMiddleware, (req, res) =>	{
	if(!req.user.isCareTaker) {
        res.send({status: 'not caretaker'});
        return;
    }
	db.query('SELECT pet_type, price FROM prices WHERE care_taker = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack);
		} else {
			res.send(dbres.rows);
		}
	});
});

app.post("/addNewPrice", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isCareTaker){
        res.send({status: 'not caretaker'});
        return;
	}
	db.query('SELECT employee_type FROM care_takers WHERE username = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack);
		} else {
			if (dbres.rows[0].employee_type === 'part-time')	{
				db.query('SELECT price FROM base_prices WHERE pet_type = $1', [req.body.pet_type], (err, slres) => {
					if (err || slres.rows.length == 0) {
						  res.send({status: 'failed'});
					} else {
						let base_price = parseFloat(slres.rows[0].price);
						if (base_price > parseFloat(req.body.new_price))	{
							res.send({error: 'Minimum price: ' + base_price});
							return;
						}

						db.query('INSERT INTO prices(care_taker, pet_type, price) VALUES ($1, $2, $3)',
							[req.user.username, req.body.pet_type, req.body.new_price], (error, results) =>	{
								if (!error)	{
									res.send({status: 'success'});
								}
								else
									res.send({status: 'failed'});
							});
					}
				});	
			}
			//full-time
			else	{
				db.query('SELECT price FROM base_prices WHERE pet_type = $1', [req.body.pet_type], (err, slres) => {
					if (err || slres.rows.length == 0) {
						  res.send({status: 'failed'});
					} else {
						let base_price = parseFloat(slres.rows[0].price);
						
						db.query('SELECT avg_rating FROM care_takers WHERE username = $1', [req.user.username], (err, result) => {
							if (err) {
								res.send({status: 'failed'});
								console.log(req.user);
							} else {
								let avg_rating = parseFloat(result.rows[0].avg_rating);
								if (avg_rating >= 4)
									base_price *= 1.2;

								db.query('INSERT INTO prices(care_taker, pet_type, price) VALUES ($1, $2, $3)',
								[req.user.username, req.body.pet_type, base_price], (error, results) =>	{
									if (!error)	{
										res.send({status: 'success'});
									}
									else
										res.send({status: 'failed'});
								});
							}
						});
					}
				});	
			}
		}
	});
});

app.post("/editPrice", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isCareTaker){
        res.send({status: 'not caretaker'});
        return;
	}
	db.query('SELECT employee_type FROM care_takers WHERE username = $1', [req.user.username], (err, dbres) => {
		if (err) {
		  	console.log(err.stack);
		} else {
			if (dbres.rows[0].employee_type === 'part-time')	{
				db.query('SELECT price FROM base_prices WHERE pet_type = $1', [req.body.pet_type], (err, slres) => {
					if (err || slres.rows.length == 0) {
						  res.send({status: 'failed'});
					} else {
						let base_price = parseFloat(slres.rows[0].price);
						if (base_price > parseFloat(req.body.new_price))	{
							res.send({error: 'Minimum price: ' + base_price});
							return;
						}

						db.query('UPDATE prices SET price = $1 WHERE care_taker = $2 AND pet_type = $3',
							[req.body.new_price, req.user.username, req.body.pet_type], (error, results) =>	{
								if (!error)	{
									res.send({status: 'success'});
								}
								else
									res.send({status: 'failed'});
							});
					}
				});	
			}
			else	{
				res.send({status: 'failed'});
			}
		}
	});
});

app.post("/deletePrice", isAuthenticatedMiddleware, (req, res) =>	{
    if(!req.user.isCareTaker){
        res.send({status: 'not caretaker'});
        return;
	}
	db.query('DELETE FROM prices WHERE pet_type = $1 AND care_taker = $2',
	[req.body.pet_type, req.user.username], (error, results) =>	{
		if (!error)	{
			res.send({status: 'success'});
		}
		else
			res.send({status: 'failed'});
	});
});

app.post("/searchCaretaker", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('SELECT care_taker, price FROM prices WHERE pet_type = $1 AND price >= $2 AND price <= $3', [req.body.pet_type, req.body.min_price, req.body.max_price], (err, dbres) => {
		if (err) {
		  	console.log(err.stack);
		} else {
			res.send(dbres.rows);
		}
	});
});

app.post("/bid", isAuthenticatedMiddleware, async (req, res) =>	{
	let base_price = 0;
	try	{
		const res = await db.query('SELECT price FROM base_prices WHERE pet_type = $1', [req.body.pet_type]);
		if (res.rows.length == 1)	{
			base_price = parseFloat(res.rows[0].price);
		}
		else	{
			res.send({error: 'failed'});
			return;
		}
	} catch (err) {
		console.log(err);
		res.send({error: 'failed'});
		return;
	}

	if (parseFloat(req.body.price) < base_price)	{
		res.send({error: 'Minimum price is $' + base_price});
		return;
	}

	//Reject if date if before today or end date before start date
	const start_date = new Date(req.body.start_date);
	const end_date = new Date(req.body.end_date);
	const today = new Date(new Date().toISOString().slice(0, 10));

	if (start_date < today)	{
		res.send({error: 'Start date cannot be before today'});
		return;
	}

	if (start_date > end_date)	{
		res.send({error: 'Start date cannot be after end date'});
		return;
	}

	let full_time = false;
	try	{
		const res = await db.query('SELECT * FROM care_takers WHERE username = $1 AND employee_type = $2', [req.body.care_taker, 'full-time']);
		if (res.rows.length == 1)
			full_time = true;
	} catch (err) {
		console.log(err);
		res.send({error: 'failed'});
		return;
	}

	if (full_time)	{
		//Try to auto accept the bid
		//Check if care_taker has > 5 on any day
		let booked_dates = {};

		try	{
			const result = await db.query('SELECT start_date, end_date FROM bids WHERE care_taker = $1 AND selected = true', 
			[req.body.care_taker]);
			for (let i = 0; i < result.rows.length; i++)	{
				for (let date = new Date(result.rows[i].start_date); date <= new Date(result.rows[i].end_date); date.setDate(date.getDate() + 1))	{
					if (date in booked_dates)
						booked_dates[date] += 1;
					else
						booked_dates[date] = 1;
				}
			}
			start_date.setHours(0,0,0,0);
			end_date.setHours(0,0,0,0);
			for (let date = new Date(start_date.getTime()); date <= end_date; date.setDate(date.getDate() + 1))	{
				if (date in booked_dates)
					booked_dates[date] += 1;
				else
					booked_dates[date] = 1;
			}
			const dates = Object.keys(booked_dates);
			let exceeded = false;
			for (let i = 0; i < dates.length; i++)	{
				if (booked_dates[dates[i]] >= 6)
					exceeded = true;
			}
			if (exceeded)	{
				res.send({error: 'Caretaker is overbooked for selected dates!'});
				return;
			}
		} catch (err) {
			console.log(err);
			res.send({error: 'Something went wrong lol'});
			return;
		}
	}
	try	{
		const result = await db.query('INSERT INTO bids (pet_owner, care_taker, pet_name, transfer_mode, start_date, end_date, daily_price, selected) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
		[req.user.username, req.body.care_taker, req.body.pet_name, req.body.transfer, start_date, end_date, req.body.price, full_time]);
		res.send({status: 'success'});
		return;
	} catch (err) {
		res.send({error: 'Invalid Bid. Have you already done the same bid?'});
		return;
	}
});

app.post("/payBid", isAuthenticatedMiddleware, async (req, res) =>	{
	try	{
		const result = await db.query('SELECT selected FROM bids WHERE pet_owner = $1 AND care_taker = $2 AND pet_name = $3 AND start_date = $4 AND end_date = $5', 
		[req.user.username, req.body.care_taker, req.body.pet_name, req.body.start_date, req.body.end_date]);
		if (result.rows.length == 1)	{
			if (!result.rows[0].selected)	{
				res.send({error: 'Please wait for Care Taker to confirm before paying'});
				return;
			}
		}
		else	{
			res.send({error: 'failed'});
			return;
		}
	} catch (err) {
		console.log(err);
		res.send({error: 'failed'});
		return;
	}

	db.query('UPDATE bids SET paid = true WHERE pet_owner = $1 AND care_taker = $2 AND pet_name = $3 AND start_date = $4 AND end_date = $5', 
	[req.user.username, req.body.care_taker, req.body.pet_name, req.body.start_date, req.body.end_date], (err, dbres) => {
		if (err) {
			  console.log(err.stack);
			  res.send({status: "fail"});
		} else {
			res.send({status: "success"});
		}
	});
});

app.post("/confirmBid", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('UPDATE bids SET selected = true WHERE pet_owner = $1 AND care_taker = $2 AND pet_name = $3 AND start_date = $4 AND end_date = $5', 
	[req.body.pet_owner, req.user.username, req.body.pet_name, req.body.start_date, req.body.end_date], (err, dbres) => {
		if (err) {
			  console.log(err.stack);
			  res.send({status: "fail"});
		} else {
			res.send({status: "success"});
		}
	});
});

app.post("/submitRating", isAuthenticatedMiddleware, (req, res) =>	{
	db.query('UPDATE bids SET rating = $1, review = $2 WHERE pet_owner = $3 AND care_taker = $4 AND pet_name = $5 AND start_date = $6 AND end_date = $7', 
	[req.body.rating, req.body.review, req.user.username, req.body.care_taker, req.body.pet_name, req.body.start_date, req.body.end_date], (err, dbres) => {
		if (err) {
			  console.log(err.stack);
			  res.send({status: "fail"});
		} else {
			db.query(`WITH rating_CTE (care_taker, ave)
			AS (
			SELECT care_taker, ROUND (AVG(rating),2) as ave
			FROM (
			SELECT care_taker, rating from bids where rating is not NULL
			)T1
			GROUP BY care_taker
			HAVING care_taker = $1
			)
			
			UPDATE care_takers
			SET avg_rating = (select ave from rating_CTE)
			WHERE username = (select care_taker from rating_CTE)`, 
			[req.body.care_taker], (err, dbres) => {
				if (err) {
					console.log(err.stack);
					res.send({status: "fail"});
				} else {
					res.send({status: "success"});
				}
			});
		}
	});
});

app.get("/getMonthSalary", isAuthenticatedMiddleware, async (req, res) =>	{
	const today = new Date(new Date().toISOString().slice(0, 10));

	let full_time = false;
	try	{
		const result = await db.query('SELECT * FROM care_takers WHERE username = $1 AND employee_type = $2', [req.user.username, 'full-time']);
		if (result.rows.length == 1)
			full_time = true;
	} catch (err) {
		console.log(err);
		res.send({error: 'failed'});
		return;
	}

	if (full_time)	{
		//Generates a list of {price} in this month for all confirmed and paid jobs
		let pet_days_prices = [];

		try	{
			const result = await db.query('SELECT start_date, end_date, daily_price FROM bids WHERE care_taker = $1 AND selected = true AND paid = true ORDER BY start_date', 
			[req.user.username]);
			for (let i = 0; i < result.rows.length; i++)	{
				for (let date = new Date(result.rows[i].start_date); date <= new Date(result.rows[i].end_date); date.setDate(date.getDate() + 1))	{
					if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())	{
						pet_days_prices.push(result.rows[i].daily_price);
					}
				}
			}
			if (pet_days_prices.length <= 60)	{
				res.send({ salary: 3000 });
				return;
			}
			else	{
				let salary = 3000;
				for (let i = 60; i < pet_days_prices.length; i++)	{
					salary += pet_days_prices[i] * 0.8;
				}
				res.send({ salary });
				return;
			}
		} catch (err) {
			console.log(err);
			res.send({error: 'Something went wrong lol'});
			return;
		}
	}
	//part time
	else	{
		//Generates a list of {price} in this month for all confirmed and paid jobs
		let pet_days_prices = [];

		try	{
			const result = await db.query('SELECT start_date, end_date, daily_price FROM bids WHERE care_taker = $1 AND selected = true AND paid = true ORDER BY start_date', 
			[req.user.username]);
			for (let i = 0; i < result.rows.length; i++)	{
				for (let date = new Date(result.rows[i].start_date); date <= new Date(result.rows[i].end_date); date.setDate(date.getDate() + 1))	{
					if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())	{
						pet_days_prices.push(result.rows[i].daily_price);
					}
				}
			}
			let salary = 0;
			for (let i = 0; i < pet_days_prices.length; i++)	{
				salary += pet_days_prices[i] * 0.75;
			}
			res.send({ salary });
			return;
		} catch (err) {
			console.log(err);
			res.send({error: 'Something went wrong lol'});
			return;
		}
	}
});

server.listen(port, () =>
	console.log(`Backend server started on port ${port}`)
);

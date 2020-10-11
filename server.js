// Need to be converted to use Postgres + Restful API, possibly express framework.
// Node-postgres guide: https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/

const { Client } = require('pg');

const client = new Client({
	user: 'postgres',
	host: 'petcare.places.sg',
	database: 'petcare',
	password: 'CS2102',
	port: 5432,
});

client.connect();
console.log("Connected to the database.");






// NodeJS Server ran using Sqlite3 and Socket.io for reference

/*const io = require("socket.io")();
const sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database("./CarTracker.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
	if (err) {
		console.error(err.message);
	}
	console.log("Connected to the database.");
});

db.serialize(() => {
	// Queries scheduled here will be serialized.
	db.run(
		`CREATE TABLE IF NOT EXISTS history (
			id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			level	INTEGER NOT NULL DEFAULT 0,
			createdAt	text DEFAULT (datetime('now','localtime')),
			name	text
		)`
	);
});

io.on("connection", client => {
	client.on("UPDATE_LEVEL", ({ level, name }) => {
		db.run(`DELETE FROM history`, [], err => {
			if (err) {
				console.error("Failed to clear database!");
			}

			db.run(`INSERT INTO history(level, name) VALUES(?,?)`, [level, name], err => {
				if (err) {
					console.error("Failed to update database!");
					return;
				} else {
					db.all(`SELECT * FROM history`, [], (err, rows) => {
						if (err) {
							throw err;
						}
						let results = [];
						rows.forEach(row => {
							results.push(row);
						});
						io.emit("DATA", results);
					});
				}
			});
		});
	});

	client.on("GET_DATA", () => {
		db.all(`SELECT * FROM history`, [], (err, rows) => {
			if (err) {
				throw err;
			}
			let results = [];
			rows.forEach(row => {
				results.push(row);
			});
			client.emit("DATA", results);
		});
	});
});

const port = 5001;
io.listen(port);
console.log("listening on port ", port);
*/
var { Client } = require('pg');
var express = require('express');
var careTakerRouter = express.Router();

const postgresUser = "postgres";
const postgresDb = "petcare";
const postgresPass = "CS2102";

const connectionString = `postgres://${postgresUser}:${postgresPass}@petcare.places.sg:5432/${postgresDb}`;
console.log(connectionString);
const client = new Client({
    connectionString: connectionString
});
client.connect();
//console.log(client);
careTakerRouter.get('/list', (req, res) => {
    const qstring = "SELECT a.care_taker, employee_type, pet_type, price, area, start_date, end_date\n" +
        "FROM availabilities a\n" +
        "LEFT JOIN care_takers c ON a.care_taker = c.login_name\n" +
        "LEFT JOIN prices p ON a.care_taker = p.care_taker;";
    client.query(qstring, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            console.log('Query Successful');
        }
        res.send(JSON.stringify(result.rows));
    });
});

module.exports = careTakerRouter;
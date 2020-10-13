const { Client } = require('pg');

const postgresUser = "postgres";
const postgresDb = "petcare";
const postgresPass = "CS2102";

var connectionString = `postgres://${postgresUser}:${postgresPass}@petcare.places.sg:5432/${postgresDb}`;
console.log(connectionString);
const client = new Client({
    connectionString: connectionString
});
client.connect();
console.log(client);
exports.list = (req, res) => {
    client.query("SELECT * FROM users", (err, result) => {
       if (err) {
           console.log(err);
           res.status(400).send(err);
       }
       res.render("users/list", {title: "Users", data:result.rows});
    });
};

exports.add = (req, res) => {
    res.render("users/add", {title: "Register User"});
};

exports.edit = (req, res) => {
    var id = req.params.id;
    client.query("SELECT * FROM users WHERE login_name=$1", [id], (err, result) => {
       if (err) {
           console.log(err);
           res.status(400).send(err);
       }
       res.render("users/edit", {title: "Edit Users", data: result.rows});
    });
}

exports.save = (req, res) => {
    var cols = [req.body.login_name, req.body.uname, req.body.password_hash];
    console.log(cols);
    client.query("INSERT INTO users VALUES ($1, $2, $3)",
        cols,
        (err, result) => {
            if (err) {
                console.log("Error, user not saved! : %s", err);
                res.render("users/add", {title: "Register User", user: "undefined", success: false, error: err});
            } else {
                res.redirect("/users");
            }
        }
    );
};
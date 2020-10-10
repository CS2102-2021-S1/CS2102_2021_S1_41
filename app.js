const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var users = require('./routes/users');
//var routes = require('./routes');
var app = express();

app.set('port', process.env.PORT || 5005);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../public')));

//app.get('/', routes.index);
app.get('/users', users.list);
//app.get('/users/add', users.add);

//app.post('/users/add', users.save);

app.listen(app.settings.port, () => {
   console.log(`Server is running on Port ${app.settings.port}. Press CTRL+C to stop server.`);
});
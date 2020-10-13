const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var userRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(app.settings.port, () => {
   console.log(`Server is running on Port ${app.settings.port}. Press CTRL+C to stop server.`);
});
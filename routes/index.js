var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
   res.render('index', {title: 'Welcome! Pet Care System (PCS) Singapore'});
});

module.exports = router;
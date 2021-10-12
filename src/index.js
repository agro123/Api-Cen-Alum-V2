const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//redireccionamiento automatico
app.get('/', function (req, res) {
    res.redirect('/api')
});

// Routes
app.use('/api', require('./endpoints/index'));

const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server on port', port);
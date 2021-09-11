const express = require('express');
const cors = require ('cors');

const app = express();

// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api',require('./endpoints/index'));

app.listen(5000);
console.log('Server on port', 5000);
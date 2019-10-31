const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// const uri = process.env.DB;
const uri = 'mongodb://localhost/savvytimer';
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', (req, res) => {
	console.log('Database Successfully Launched!!');
});

const userDetailsRouter = require('./routes/userDetails');
const registerRouter = require('./routes/register');

app.use('/userDetails', userDetailsRouter);
app.use('/register', registerRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => {
	console.log(`server running on port: ${port}`);
});

// importing the required modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./db/connect');
require('dotenv').config();
const app = express();

// parse form data
app.use(express.urlencoded({ extended: false }));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// setting routes
const habits = require('./routes/habits');
app.use('/', habits);

// port number
const port = process.env.PORT || 3000;

// connecting to local database
const dbUrl = "mongodb://localhost:27017/my-habit-tracker";
connectDB(dbUrl);

// connectDB(process.env.MONGO_URI);  // connects to database specified in .env file

// connecting to server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}...`)
});

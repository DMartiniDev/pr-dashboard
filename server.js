const { app, http } = require('./setupServer.js');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load environment configurations
require('dotenv').config();
const keys = require('./config/keys');

// Connect to MongoDB
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(e => console.log(e));

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
require('./routes/routes')(app);

// Server running process
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

http.listen(PORT, () => console.log(`Server is running on port ${PORT} in ${ENV} mode!`));
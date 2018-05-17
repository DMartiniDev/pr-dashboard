const { app, http } = require('./setupServer.js');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const keys = require('./config/keys');
const socket = require('./services/socket');

// Load environment configurations
require('dotenv').config();

// Mongoose models
require('./models/Pullrequest');
require('./models/Repository');
require('./models/Organisation');
require('./models/User');

// authentication services
require('./services/passport');

// Error Notification Service
require('./services/raven');

// Connect to MongoDB
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(e => console.log(e));

// Remove Sockets after reboot
socket.removeSockets();

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
require('./routes/routes')(app);

// Server running process
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

http.listen(PORT, () =>
  console.log(`Server is running on port ${PORT} in ${ENV} mode!`),
);

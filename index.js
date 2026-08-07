process.on('uncaughtException', function (err) {
  console.error(err);
  console.log('Node NOT Exiting...');
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const http = require('http');
let express = require('express');
const helmet = require('helmet');
let morgan = require('morgan');
import { v4 as uuidv4 } from 'uuid';
let logger = require('./utils/logger');
const config = require('./config');
const cert = fs.readFileSync(config.tls.cert);
const key = fs.readFileSync(config.tls.key);

morgan.token('id', function getId(req) {
  return req.id;
});

let app = express();
app.enable('trust proxy');
app.use(helmet.hsts());
app.use(helmet.hidePoweredBy());

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit || 200,
});
app.use(limiter);

app.use(function (req, res, next) {
  req.id = uuidv4();
  next();
});

app.use(
  morgan(
    '                           ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  ),
);

let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json(null)); // parse application/json

app.use('/static', express.static('static'));
app.use(require('./controllers/api'));
// SECURITY: website controller disabled. It calls lightning.listChannels at
// load time (requires offchain:read) and exits the process on any LND error.
// The public web UI (/, /qr) is not needed for the LNURL-only server.
// app.use(require('./controllers/website'));

let server = http.createServer(app)
  .listen(3000, () => {console.log('HTTP server listening on port 3000')});

module.exports = server;

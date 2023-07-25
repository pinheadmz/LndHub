const fs = require('fs');
const path = require('path');

let config = {
  enableUpdateDescribeGraph: false,
  postRateLimit: 100,
  rateLimit: 200,
  forwardReserveFee: 0.01, // default 0.01
  intraHubFee: 0.003, // default 0.003
  bitcoind: {
    rpc: 'http://polaruser:polarpass@127.0.0.1:18443/',
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    password: '',
    db: 0,
  },
  lnd: {
    url: '127.0.0.1:10001',
    password: 'polarpass',
    cert: '/Users/matthewzipkin/.polar/networks/1/volumes/lnd/alice/tls.cert',
    macaroon: '/Users/matthewzipkin/.polar/networks/1/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon'
  },
  tls: {
    cert: path.join(__dirname, 'test', 'data', 'cert.crt'),
    key: path.join(__dirname, 'test', 'data', 'cert.key')
  },
  blockclock: {
    path: path.join(__dirname, 'test', 'data', 'ln.txt')
  }
};

if (process.env.CONFIG) {
  console.log('using config from env');
  config = JSON.parse(process.env.CONFIG);
}

if (process.env.CONFIG_FILE) {
  console.log(`using config from file: ${process.env.CONFIG_FILE}`);
  config = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, 'ascii'));
}

module.exports = config;

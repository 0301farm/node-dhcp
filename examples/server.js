
var dhcpd = require('../lib/dhcp.js');

var s = dhcpd.createServer({
  // System settings
  range: [
    "192.168.3.10", "192.168.3.99"
  ],
  forceOptions: ['hostname'], // Options that need to be sent, even if they were not requested
  randomIP: true, // Get random new IP from pool instead of keeping one ip
  staticFunction: function (mac, callback) {
    if (mac === 'AA-BB-CC-DD-EE-FF') {
      return callback('192.168.3.150');
    }

    return callback(null);
  },

  // Option settings
  netmask: '255.255.255.0',
  router: [
    '192.168.0.1'
  ],
  timeServer: null,
  nameServer: null,
  dns: ["8.8.8.8", "8.8.4.4"],
  hostname: "kacknup",
  domainName: "xarg.org",
  broadcast: '192.168.0.255',
  server: '192.168.0.1', // This is us
  maxMessageSize: 1500,
  leaseTime: 86400,
  renewalTime: 60,
  rebindingTime: 120,
  bootFile: function (mac, callback) {
    return callback(mac);
  }
});

s.on('message', function (data) {
  console.log(data);
});

s.on('bound', function(state) {
  console.log("BOUND:");
  console.log(state);
});

s.on("error", function (err, data) {
  console.log(err, data);
});

s.on("listening", function (sock) {
  var address = sock.address();
  console.info('Server Listening: ' + address.address + ':' + address.port);
});

s.on("close", function () {
  console.log('close');
});

s.listen();

process.on('SIGINT', () => {
    s.close();
});

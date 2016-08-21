const net = require('net');
const fs = require('fs');

module.exports = function(socket, onData) {
  return {
    start: function() {
      fs.stat(socket, err => {
        if (!err) {
          fs.unlinkSync(socket);
        }

        const unixServer = net.createServer(connection => {
          const reply = connection.write.bind(connection);
          connection.on('data', data => onData(reply, JSON.parse(data.toString())));
        });

        unixServer.listen(socket);
      });
    }
  };
};

const server = require('./server.js');


const port = 5000;
server.listen(port, function() {
  console.log(`Listening on http://localhost:${port}`);
});

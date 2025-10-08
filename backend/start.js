
const { app, server } = require('./server');
const PORT = 5001; // Force port to 5001

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready for video calls`);

});

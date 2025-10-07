const app = require('./server');
const PORT = 5001; // Force port to 5001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

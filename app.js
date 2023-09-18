const express = require('express');
const applyMiddleware = require('./middleware');
const userRoutes = require('./routes/userRoutes');

const app = express();

applyMiddleware(app);

app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = server;

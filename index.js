const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

const app = require('./server/app');

(async function () {
  try {
    mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');
  } catch (err) {
    throw new Error(err);
  }
})();

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));

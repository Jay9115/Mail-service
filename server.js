// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const mailRoutes = require('./routes/mail');

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;

(async () => {
  await connectDB(process.env.MONGODB_URI);

  app.get('/', (req, res) => res.send('OTP Mail Service running'));
  app.use('/auth', authRoutes);
  app.use('/mail', mailRoutes);

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})();

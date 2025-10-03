// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./Routes/auth.js');
const mailRoutes = require('./Routes/mail.js');

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;

(async () => {
  await connectDB(process.env.MONGODB_URI);

  app.get('/', (req, res) => res.send('OTP Mail Service running'));
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Mail Service healthy',
      timestamp: new Date().toISOString()
    });
  });
  app.use('/auth', authRoutes);
  app.use('/mail', mailRoutes);

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})();

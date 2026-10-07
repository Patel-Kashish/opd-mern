require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '10kb' }));

app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));

app.use((req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on port ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
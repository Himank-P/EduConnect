const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const apiRoutes = require('./routes'); 
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('EduConnect Backend API is running...');
});

app.listen(port, () => {
  console.log(`EduConnect server listening on port ${port}`);
});
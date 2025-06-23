const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const createroutes = require('./routes/postjob');
const authRoutes = require('./routes/auth');
const profileRouts = require('./routes/profile')
const registrationrouts = require('./routes/Registration')
const oppRoutes = require('./routes/Opp_add')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', createroutes);
app.use('/api', authRoutes);
app.use('/api', profileRouts);
app.use('/api', registrationrouts);
app.use('/api/opportunity', oppRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
})
  .catch((err) => console.error('MongoDB connection error:', err));

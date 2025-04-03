const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Create User model

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dating_app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server/index.js

require('dotenv').config(); // .env se data load karein
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware: Front-end se aane wale data ko handle karna
app.use(cors()); 
app.use(express.json()); // JSON data ko read karne ke liye

// --- 1. MongoDB Atlas se connect karein ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Atlas se Connected!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- 2. Schema (Data structure) define karein ---
const itemSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// --- 3. API Endpoints (Routes) ---

// Data Save (POST Request) karne ke liye
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item({
      text: req.body.text // Front-end se aane wala data
    });
    const item = await newItem.save();
    res.json(item); // Saved item wapas bhej dein
  } catch (err) {
    res.status(500).send('Server error while saving data');
  }
});

// Sabhi Data Fetch (GET Request) karne ke liye
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items); // Sabhi items wapas bhej dein
  } catch (err) {
    res.status(500).send('Server error while fetching data');
  }
});

// Server ko start karein
app.listen(PORT, () => console.log(`Server Port ${PORT} par chal raha hai`));
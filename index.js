// mern-backend/index.js

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

// --- Vercel Health Check Route ---
// Yeh root route Vercel ke deployment health check ko pass karega.
app.get('/', (req, res) => {
    res.send('MERN Backend API is running!');
});

// --- MongoDB Atlas Connection ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Atlas se Connected!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Mongoose Schema (Data structure) ---
const itemSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// --- API Endpoints (Routes) ---

// 1. Data Save (POST Request)
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

// 2. Sabhi Data Fetch (GET Request)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items); // Sabhi items wapas bhej dein
  } catch (err) {
    res.status(500).send('Server error while fetching data');
  }
});

// Server ko start karein
// Note: Vercel serverless function use karta hai, lekin yeh line local testing ke liye zaroori hai.
app.listen(PORT, () => console.log(`Server Port ${PORT} par chal raha hai`));
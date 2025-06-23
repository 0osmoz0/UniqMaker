const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

const API_URL = "https://api.midocean.com/gateway/printpricelist/2.0";
const API_KEY = "b20cf552-d111-4ff2-8c2d-3b631fc9fca4"; // ta clé API

app.use(cors());

app.get('/printprices', async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "x-Gateway-APIKey": API_KEY,
        "Accept": "application/json"
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Erreur API :", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur proxy en écoute sur http://localhost:${PORT}`);
});

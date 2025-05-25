const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const file = './data.json';

app.post('/api/freelancers', (req, res) => {
  const newFreelancer = req.body;
  let data = [];

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    data = JSON.parse(content);
  }

  data.push(newFreelancer);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  res.status(200).json({ message: 'Données reçues' });
});

app.get('/api/freelancers', (req, res) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    const data = JSON.parse(content);
    res.status(200).json(data);
  } else {
    res.status(200).json([]);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

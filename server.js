const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = 3001; // You can change the port if needed

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.get('/resources/life-progress-stats.json', (req, res) => {
  const filePath = path.join(__dirname, 'public/resources/life-progress-stats.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(JSON.parse(data));
  });
});

app.put('/resources/life-progress-stats.json', (req, res) => {
  const filePath = path.join(__dirname, 'public/resources/life-progress-stats.json');
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.send('File updated successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

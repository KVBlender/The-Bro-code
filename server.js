const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/get-articles', (req, res) => {
  const filePath = path.join(__dirname, 'articles.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file.');
    res.send(data);
  });
});

app.post('/save-article', (req, res) => {
  const { number, title, content } = req.body;
  const newEntry = `Article ${number}\n${content.trim()}\n\n`;
  const filePath = path.join(__dirname, 'articles.txt');

  // Append or replace if article already exists
  fs.readFile(filePath, 'utf8', (err, data) => {
    let updatedText = '';
    if (err || !data.includes(`Article ${number}`)) {
      updatedText = data + newEntry;
    } else {
      const regex = new RegExp(`Article ${number}[\\s\\S]*?(?=Article \\d+|$)`, 'g');
      updatedText = data.replace(regex, newEntry);
    }

    fs.writeFile(filePath, updatedText, (err) => {
      if (err) return res.status(500).send('Failed to save.');
      res.send('Article saved!');
    });
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

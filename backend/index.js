const express = require('express');
const request = require('request');
const cherio = require('cherio');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/images', (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL is required');
  }

  request(url, (err, response, html) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }

    if (response.statusCode !== 200) {
      return res.status(404).send('Not Found');
    }

    const $ = cherio.load(html);
    const imageLinks = [];

    $('img').each((index, image) => {
      const img = $(image).attr('src');
      //const baseUrl = url;
      const link =  img;
      imageLinks.push(link);
    });

    res.json(imageLinks);
    console.log(imageLinks);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});






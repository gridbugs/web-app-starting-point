const express = require('express');
const app = express();
const port = 8000;
app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));
app.get('/bundle.js', (req, res) => res.sendFile(__dirname + '/dist/bundle.js'));
app.listen(port, () => console.log(`Listening on port ${port}`));

const express = require('express');
const app = express();
const port = 8000;
app.set('view engine', 'ejs');
app.set('views', 'public');
app.get('/', (req: any, res: any) => res.render("index"));
app.get('/bundle.js', (req: any, res: any) => res.sendFile(__dirname + '/public/bundle.js'));
app.listen(port, () => console.log(`Listening on port ${port}`));

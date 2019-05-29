import { Page } from './client/page';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

const app = express();
const port = 8080;
app.get('/', (req: express.Request, res: express.Response) => {
  res.send(ReactDOMServer.renderToStaticMarkup(<Page />));
});
app.get('/bundle.js', (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + '/public/bundle.js');
});
app.get('/user', (req: express.Request, res: express.Response) => {
  console.log(req.query);
  res.end();
});
app.listen(port, () => console.log(`Listening on port ${port}`));

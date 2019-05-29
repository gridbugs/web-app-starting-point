import { Page } from './client/page';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

const app = express();
const port = 8080;
app.get('/', (req: any, res: any) => {
  res.write('<!doctype html>');
  res.write(ReactDOMServer.renderToStaticMarkup(<Page />));
  res.end();
});
app.get('/bundle.js', (req: any, res: any) => res.sendFile(__dirname + '/public/bundle.js'));

app.listen(port, () => console.log(`Listening on port ${port}`));

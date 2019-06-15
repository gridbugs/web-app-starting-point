import { Page } from './client/page';
import { USER_FORM_BUILDER } from './client/hello';
import express from 'express';
import { render } from 'preact-render-to-string';
import { h } from 'preact';
/** @jsx h */

function getPort(): number {
  const port = process.env.PORT;
  if (typeof port === 'string') {
    return parseInt(port);
  } else {
    return 8080;
  }
}

const app = express();
const port = getPort();
app.get('/', (req: express.Request, res: express.Response) => {
  res.send(render(<Page />));
});
app.get('/bundle.js', (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + '/public/bundle.js');
});
app.get('/user', (req: express.Request, res: express.Response) => {
  let user = USER_FORM_BUILDER.parse(req.query);
  console.log(USER_FORM_BUILDER.parse(req.query));
  res.send(JSON.stringify(user));
});
app.listen(port, () => console.log(`Listening on port ${port}`));

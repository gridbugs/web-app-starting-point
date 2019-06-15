import { Page } from './client/page';
import { User } from './client/hello';
import express from 'express';
import { Router } from './form-express';
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

const router = new Router();
const app = express();
const port = getPort();
app.get('/', (req: express.Request, res: express.Response) => {
  res.send(render(<Page />));
});
app.get('/bundle.js', (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + '/public/bundle.js');
});
router.route(app, User.form(), (user: User, req: express.Request, res: express.Response) => {
  console.log(user);
  res.send(JSON.stringify(user));
});
app.listen(port, () => console.log(`Listening on port ${port}`));

import {Form, Method, ObjectQuery} from './form';
import express from 'express';

export class Router {
  route<T>(
    app: express.Application,
    form: Form<T>,
    f: (t:T, req:express.Request, res: express.Response)=>void) {
    const toRoute = (req: express.Request, res: express.Response) => {
      let t = form.parse(new ObjectQuery(req.query));
      f(t, req, res);
    };
    if (form.method() === Method.Get) {
      app.get(`/${form.action()}`, toRoute);
    } else if (form.method() === Method.Post) {
      app.post(`/${form.action()}`, toRoute);
    }
  }
}

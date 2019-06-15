import { h, Component } from 'preact';
import { PreactFormRenderer } from './form-preact';
import { Form, FormListNil, Method, TextField } from '../form';
/** @jsx h */

export class User {
  private readonly name: string;
  private readonly age: number;
  public constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  public static form(): Form<User> {
    return new FormListNil()
    .cons({ 'name': new TextField().labelled("Name") })
    .cons({ 'age': new TextField().map(parseInt).labelled("Age") })
    .map(({name, age}) => new User(name, age))
    .build('user', Method.Get);
  }
}

export class Hello extends Component {
  public render() {
    return User.form().render(new PreactFormRenderer());
  }
}

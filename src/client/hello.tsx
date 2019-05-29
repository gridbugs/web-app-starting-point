import React from 'react';
import { Form, TextInput, Join, FormBuilder } from './form';

function makeForm(action: string): FormBuilder<{name: string, age: number}> {
  return new Join({
    name: new TextInput(),
    age: new TextInput().map(parseInt),
  });
}

export class Hello extends React.Component {
  public render() {
    let form = makeForm("user");
    return <div className="example">{form.render()}</div>;
  }
}

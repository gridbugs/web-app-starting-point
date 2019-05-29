import React from 'react';
import { Form, TextInput, InputListNil, FormBuilder } from './form';

function makeForm(action: string): Form<{name: string, age: number}> {
  return new InputListNil()
    .cons('name', new TextInput())
    .cons('age', new TextInput().map(parseInt))
    .build(action);
}

export class Hello extends React.Component {
  public render() {
    let form = makeForm('user');
    return <div className='example'>{form.render()}</div>;
  }
}

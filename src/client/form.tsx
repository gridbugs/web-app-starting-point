import React from 'react';

export class Form<T> extends React.Component {
  private readonly builder: FormBuilder<T>;
  private readonly action: string;
  public constructor(builder: FormBuilder<T>, action: string) {
    super({});
    this.builder = builder;
    this.action = action;
  }
  public render() {
    return <form action={this.action} method='get'>{this.builder.render()}<input type='submit'></input></form>;
  }
}

export class FormBuilder<T> extends React.Component {
  public constructor() {
    super({})
  }
  public build(action: string): Form<T> {
    return new Form(this, action);
  }
  public map<U>(f: (t:T)=>U): FormBuilder<U> {
    return new Map(this, f);
  }
}

export class Map<T, U> extends FormBuilder<U> {
  private readonly f: ((t:T)=>U);
  private readonly builder: FormBuilder<T>;
  public constructor(builder: FormBuilder<T>, f: (t:T)=>U) {
    super();
    this.f = f;
    this.builder = builder;
  }
}

export class TextInput extends FormBuilder<string> {
  public render() {
    return <input type='text' name='value'></input>;
  }
}

type Wrap<T> = {
  [P in keyof T]: FormBuilder<T[P]>;
};

export class Join<T, U extends Wrap<T>> extends FormBuilder<T> {
  private u: U;
  public constructor(u: U) {
    super();
    this.u = u;
  }
}

function f() {
  let x: FormBuilder<{name: string, age: string}> = new Join({
    name: new TextInput(),
    age: new TextInput(),
  });
}

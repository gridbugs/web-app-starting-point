import React from 'react';

export class Form<T> extends React.PureComponent {
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

export class FormBuilder<T> extends React.PureComponent {
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
  public render() {
    return this.builder.render();
  }
}

export class TextInput extends FormBuilder<string> {
  public render() {
    return <input type='text' name='value'></input>;
  }
}

type Wrap<T> = {
  [P in keyof T]: FormBuilder<T[P]>;
}

export class Join<T, U extends Wrap<T>> extends FormBuilder<T> {
  private u: U;
  public constructor(u: U) {
    super();
    this.u = u;
  }
}

export abstract class InputList<T> extends FormBuilder<T> {
  public cons<K extends string, H>(key: K, head: FormBuilder<H>): InputListCons<K, H, T> {
    return new InputListCons(key, head, this);
  }
}
export class InputListNil extends InputList<{}> {
  public render() {
    return false;
  }
}
export class InputListCons<K extends string, H, T> extends InputList<{ [P in K]: H } & T> {
  private readonly tail: InputList<T>;
  private readonly head: FormBuilder<H>;
  private readonly key: K;
  public constructor(key: K, head: FormBuilder<H>, tail: InputList<T>) {
    super();
    this.tail = tail;
    this.head = head;
    this.key = key;
  }
  public render() {
    return <div>{this.tail.render()}{this.head.render()}</div>;
  }
}

function a(): InputList<{name: string, age: number}> {
  return new InputListNil()
    .cons('name', new TextInput())
    .cons('age', new TextInput().map(parseInt));
}

function f() {
  let x: FormBuilder<{name: string, age: string}> = new Join({
    name: new TextInput(),
    age: new TextInput(),
  });
}

function g<K extends string>(k: K): { [P in K]: string } {
  return { [k]: "foo" };
}

function h(): { foo: string } {
  return g('foo');
}

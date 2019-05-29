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
    let context = new Context(0);
    return <form action={this.action} method='get'>{this.builder.render(context)}<input type='submit'></input></form>;
  }
}

export abstract class FormBuilder<T> {
  public build(action: string): Form<T> {
    return new Form(this, action);
  }
  public map<U>(f: (t:T)=>U): FormBuilder<U> {
    return new Map(this, f);
  }
  public render(_context: Context): null | JSX.Element {
    return null;
  }
  public abstract parse(context: Context, query: Query): T;
}

class Context {
  private readonly value: number;
  public constructor(value: number) {
    this.value = value;
  }
  public name(): string {
    return this.value.toString();
  }
  public next(): Context {
    return new Context(this.value + 1);
  }
}

type Query = { [index: string]: string };

export class Map<T, U> extends FormBuilder<U> {
  private readonly f: ((t:T)=>U);
  private readonly builder: FormBuilder<T>;
  public constructor(builder: FormBuilder<T>, f: (t:T)=>U) {
    super();
    this.f = f;
    this.builder = builder;
  }
  public render(context: Context): null | JSX.Element {
    return this.builder.render(context);
  }
  public parse(context: Context, query: Query): U {
    return this.f(this.builder.parse(context, query));
  }
}

export class TextInput extends FormBuilder<string> {
  private label?: string;
  public constructor(label?: string) {
    super();
    this.label = label;
  }
  public render(context: Context): JSX.Element {
    let input = <input type='text' name={context.name()}></input>;
    let label = this.label === null ? null : <div><label>{this.label}</label></div>;
    return <div>{label}{input}</div>;
  }
  public parse(context: Context, query: Query): string {
    return query[context.name()];
  }
}

export abstract class InputList<T> extends FormBuilder<T> {
  public cons<K extends string, H>(key: K, head: FormBuilder<H>): InputListCons<K, H, T> {
    return new InputListCons(key, head, this);
  }
}
export class InputListNil extends InputList<{}> {
  public parse(_context: Context, _query: Query): {} {
    return {};
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
  public render(context: Context): JSX.Element {
    return <div>{this.tail.render(context.next())}{this.head.render(context)}</div>;
  }
  public parse(context: Context, query: Query): { [P in K]: H } & T {
    let head = this.head.parse(context, query);
    let tail = this.tail.parse(context.next(), query);
    //return { [this.key]: head, ...tail };
    throw "";
  }
}


function g<K extends string>(k: K): { [P in K]: string } {
  return { [k]: "foo" };
}

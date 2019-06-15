import { h, Component } from 'preact';
/** @jsx h */

export class Form<T> extends Component {
  private readonly builder: FormBuilder<T>;
  private readonly action: string;
  public constructor(builder: FormBuilder<T>, action: string) {
    super({});
    this.builder = builder;
    this.action = action;
  }
  public render() {
    return <form action={this.action} method='get'>
      {this.builder.render()}
      <input type='submit'></input>
      </form>;
  }
  public parse(query: Query): T {
    return this.builder.parse(query);
  }
}

export abstract class FormBuilder<T> {
  public build(action: string): Form<T> {
    return new Form(this, action);
  }
  public map<U>(f: (t:T)=>U): FormBuilder<U> {
    return new Map(this, f);
  }
  public renderWithContext(_context: Context): null | JSX.Element {
    return null;
  }
  public abstract parseWithContext(context: Context, query: Query): T;
  public render() {
    let context = new Context(0);
    return this.renderWithContext(context);
  }
  public parse(query: Query): T {
    return this.parseWithContext(new Context(0), query);
  }
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
  public renderWithContext(context: Context): null | JSX.Element {
    return this.builder.renderWithContext(context);
  }
  public parseWithContext(context: Context, query: Query): U {
    return this.f(this.builder.parseWithContext(context, query));
  }
}

export class TextInput extends FormBuilder<string> {
  private label?: string;
  public constructor(label?: string) {
    super();
    this.label = label;
  }
  public renderWithContext(context: Context): JSX.Element {
    let input = <input type='text' name={context.name()}></input>;
    let label = this.label === null ? null : <div><label>{this.label}</label></div>;
    return <div>{label}{input}</div>;
  }
  public parseWithContext(context: Context, query: Query): string {
    return query[context.name()];
  }
}

export abstract class InputList<T> extends FormBuilder<T> {
  public cons<K extends string, H>(key: K, head: FormBuilder<H>): InputListCons<K, H, T> {
    return new InputListCons(key, head, this);
  }
}
export class InputListNil extends InputList<{}> {
  public parseWithContext(_context: Context, _query: Query): {} {
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
  public renderWithContext(context: Context): JSX.Element {
    return <div>{this.tail.renderWithContext(context.next())}{this.head.renderWithContext(context)}</div>;
  }
  public parseWithContext(context: Context, query: Query): { [P in K]: H } & T {
    let head = this.head.parseWithContext(context, query);
    let tail = this.tail.parseWithContext(context.next(), query);
    // this type assertion shouldn't be necessary
    let head_obj = { [this.key]: head } as { [P in K]: H };
    return { ...head_obj, ...tail };
  }
}

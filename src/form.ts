export abstract class FormRenderer<R> {
  public abstract text(name: string): R;
  public abstract empty(): R;
  public abstract compose(elements: R[]): R;
  public abstract form(body: R, action: string, method: Method): R;
  public abstract label(label: string, element: R): R;
}

export abstract class Query {
  public abstract getField(key: string): string;
}

export class ObjectQuery extends Query {
  private readonly _object: { [index: string]: string };
  public constructor(o: { [index: string]: string }) {
    super();
    this._object = o;
  }
  public getField(key: string): string {
    return this._object[key];
  }
}

export class Context {
  private readonly value: number;
  public constructor(value: number = 0) {
    this.value = value;
  }
  public name(): string {
    return this.value.toString();
  }
  public next(): Context {
    return this.add(1);
  }
  public add(n: number): Context {
    return new Context(this.value + n);
  }
}

export const enum Method {
  Get = 'GET',
  Post = 'POST',
}

export class Form<T> {
  private readonly _method: Method;
  private readonly _action: string;
  private readonly builder: FormBuilder<T>;
  public constructor(builder: FormBuilder<T>, action: string, method: Method) {
    this.builder = builder;
    this._action = action;
    this._method = method;
  }
  public render<R>(renderer: FormRenderer<R>): R {
    const body = this.builder.render(renderer);
    return renderer.form(body, this.action(), this.method());
  }
  public parse(query: Query): T {
    return this.builder.parse(query);
  }
  public method(): Method {
    return this._method;
  }
  public action(): string {
    return this._action;
  }
}

export abstract class FormBuilder<T> {
  public map<U>(f: (t:T)=>U): FormBuilder<U> {
    return new Map(this, f);
  }
  public labelled(label: string): FormBuilder<T> {
    return new Labelled(this, label);
  }
  public abstract parseWithContext(context: Context, query: Query): [T, Context];
  public parse(query: Query): T {
    return this.parseWithContext(new Context(), query)[0];
  }
  public abstract renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context];
  public render<R>(renderer: FormRenderer<R>): R {
    return this.renderWithContext(new Context(), renderer)[0];
  }
  public build(action: string, method: Method): Form<T> {
    return new Form(this, action, method)
  }
}

export class Map<T, U> extends FormBuilder<U> {
  private readonly child: FormBuilder<T>;
  private readonly f: (t:T)=>U;
  public constructor(t: FormBuilder<T>, f: (t:T)=>U) {
    super()
    this.child = t;
    this.f = f;
  }
  public renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context] {
    return this.child.renderWithContext(context, renderer);
  }
  public parseWithContext(context: Context, query: Query): [U, Context] {
    const [parsed, nextContext] = this.child.parseWithContext(context, query);
    return [this.f(parsed), nextContext];
  }
}

export class Labelled<T> extends FormBuilder<T> {
  private readonly label: string;
  private readonly child: FormBuilder<T>;
  public constructor(t: FormBuilder<T>, label: string) {
    super()
    this.label = label;
    this.child = t;
  }
  public renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context] {
    const [child, nextContext] = this.child.renderWithContext(context, renderer);
    return [renderer.label(this.label, child), nextContext];
  }
  public parseWithContext(context: Context, query: Query): [T, Context] {
    return this.child.parseWithContext(context, query);
  }
}

export class TextField extends FormBuilder<string> {
  public renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context] {
    return [renderer.text(context.name()), context.next()];
  }
  public parseWithContext(context: Context, query: Query): [string, Context] {
    return [query.getField(context.name()), context.next()];
  }
}

type FormBuilderFields<T> = {
  [P in keyof T]: FormBuilder<T[P]>;
};

export abstract class FormList<T> extends FormBuilder<T> {
  public abstract renderAppendingToArray<R>(array: R[], context: Context, renderer: FormRenderer<R>): Context;
  public cons<H>(head: FormBuilderFields<H>): FormListCons<H, T> {
    return new FormListCons(head, this);
   }
}

export class FormListNil extends FormList<{}> {
  public renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context] {
    return [renderer.empty(), context];
  }
  public renderAppendingToArray<R>(_array: R[], context: Context, _renderer: FormRenderer<R>): Context {
    return context;
  }
  public parseWithContext(context: Context, _query: Query): [{}, Context] {
    return [{}, context];
  }
}

export class FormListCons<H, T> extends FormList<H & T> {
  private readonly head: FormBuilderFields<H>;
  private readonly tail: FormList<T>;
  public constructor(head: FormBuilderFields<H>, tail: FormList<T>) {
    super();
    this.head = head;
    this.tail = tail;
  }
  public renderWithContext<R>(context: Context, renderer: FormRenderer<R>): [R, Context] {
    let array: R[] = [];
    let nextContext = this.renderAppendingToArray(array, context, renderer);
    return [renderer.compose(array), nextContext];
  }
  private sortedHeadKeys(): (keyof FormBuilderFields<H>)[] {
    let keys = Object.keys(this.head) as (keyof FormBuilderFields<H>)[];
    keys.sort();
    return keys;
  }
  public renderAppendingToArray<R>(array: R[], context: Context, renderer: FormRenderer<R>): Context {
    context = this.tail.renderAppendingToArray(array, context, renderer);
    const keys = this.sortedHeadKeys();
    for (const key of keys) {
      const [rendered, nextContext] = this.head[key].renderWithContext(context, renderer);
      context = nextContext;
      array.push(rendered);
    }
    return context;
  }
  public parseWithContext(context: Context, query: Query): [H & T, Context] {
    const [tail_obj, nextContext] = this.tail.parseWithContext(context, query);
    context = nextContext;
    const keys = this.sortedHeadKeys();
    let head_obj: { [index: string]: any } = {};
    for (const key of keys) {
      const [parsed, nextContext] = this.head[key].parseWithContext(context, query);
      context = nextContext;
      head_obj[key as string] = parsed;
    }
    let head_obj_typed = head_obj as H;
    let obj = {...head_obj_typed, ...tail_obj };
    return [obj, context];
  }
}

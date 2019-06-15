import { h } from 'preact';
import * as form from '../form';
/** @jsx h */

export class PreactFormRenderer extends form.FormRenderer<JSX.Element | null> {
  public text(name: string): JSX.Element {
    return <div><input type='text' name={name}></input></div>;
  }
  public empty(): null {
    return null;
  }
  public compose(elements: (JSX.Element | null)[]): JSX.Element {
    return <div>{elements}</div>;
  }
  public form(body: JSX.Element | null, action: string, method: form.Method): JSX.Element {
    return <form action={action} method={method}>
      {body}
      <input type='submit'></input>
      </form>;
  }
  public label(label: string, element: null | JSX.Element): JSX.Element {
    return <div><label>{label}</label>{element}</div>;
  }
}

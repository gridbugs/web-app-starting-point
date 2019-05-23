import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Hello extends React.Component {
  public render() {
    return <div className="example">Hi!</div>;
  }
}

console.log('hi');

ReactDOM.render(<Hello />, document.getElementById('root'));

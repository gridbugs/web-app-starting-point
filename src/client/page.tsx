import React from 'react';
import { Hello } from './hello';

export function Page() {
  return <div>
    <div id="root"><Hello /></div>
    <script src="/bundle.js"></script>
    </div>;
}

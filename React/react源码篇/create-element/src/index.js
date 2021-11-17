// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './mreact';
import ReactDOM from './mreact/ReactDom';
import './index.css';

const jsx = <div className="border">
  <p>Hello World</p>
</div>

// vnode->node, 把node渲染更新到container上
ReactDOM.render(
  jsx,
  document.getElementById('root')
);


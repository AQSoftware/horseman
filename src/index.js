// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {
  MiniApp
} from 'aq-miniapp';
import View from './views/View';
import Create from './views/Create';
import './index.css';

ReactDOM.render(
  <MiniApp
    create={Create}
    join={View}
    data={{}}
    devt={true}
  />,
  document.getElementById('root')
);

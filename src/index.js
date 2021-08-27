import React from 'react';
import { render } from 'react-dom';

import App from './app/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./scss/main.scss";

render(<App />, document.getElementById('root'));
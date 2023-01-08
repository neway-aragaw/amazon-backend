import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StateProvider } from './Context/StateProvider'; 
import {BrowserRouter as Router} from 'react-router-dom'
import reducer,{initialState} from './Context/reducer';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
       <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </Router>
);



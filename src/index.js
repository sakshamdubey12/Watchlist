import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store';  // Import your Redux store
import { BrowserRouter as Router } from 'react-router-dom';
ReactDOM.render(
  <Provider store={store}>  {/* Wrap App in Provider */}
  <Router>

    <App />
  </Router>
  </Provider>,
  document.getElementById('root')
);

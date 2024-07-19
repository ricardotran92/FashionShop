import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { store } from './redux/store';

// Importing ag-Grid styles globally
import 'ag-grid-community/styles/ag-grid.css'; // Core styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme

import 'react-phone-number-input/style.css' 

// Importing slick-carousel styles globally
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
// ref: https://react-redux.js.org/api/provider  provide the store to the rest of the app
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


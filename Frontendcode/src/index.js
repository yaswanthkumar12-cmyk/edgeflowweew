import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';



const root = ReactDOM.createRoot(document.getElementById('root'));

// window.addEventListener('storage', (event) => {
//     if (event.storageArea === localStorage && !localStorage.getItem('email') ) {
//         window.location.href = '/login';
//     }
// });

window.addEventListener('storage', (event) => {
  // Ensure the storage event was triggered on the same storage object
  if (event.storageArea === localStorage) {
      // Check if critical authentication details are missing
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (!email || !role || !token) {
          console.log('Critical auth details are missing. Redirecting to login.');
          window.location.href = '/login'; // Redirect to login
      }
  }
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

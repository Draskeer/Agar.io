import React from 'react';
import ReactDOM from 'react-dom/client';  // Importer createRoot à partir de 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Utilisation de createRoot à la place de render
const root = ReactDOM.createRoot(document.getElementById('root')); // Créer la racine
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Chat from './Chat';
import Lesson from './Lesson'; // Import the Lesson component
import Slideshow from './Slideshow';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/lesson/de" element={<Lesson />} />
        <Route path="/slideshow/de" element={<Slideshow />} />
        <Route path="/lesson/fr" element={<Lesson />} />
        <Route path="/slideshow/fr" element={<Slideshow />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

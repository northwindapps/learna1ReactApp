import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Import CSS file for styling

const App = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Menu</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/lesson">Lesson</Link></li>
            <li><Link to="/slideshow">Slideshow</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Welcome to the Chat App</h1>
        <p>Choose a menu option to get started.</p>
      </main>
    </div>
  );
};

export default App;

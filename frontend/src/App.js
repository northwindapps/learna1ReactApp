import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Import CSS file for styling

const App = () => {
  const [popupType, setPopupType] = useState(null); // To determine if it's for Lesson or Slideshow
  const navigate = useNavigate();

  const handlePopupClick = (type) => {
    setPopupType(type); // Set popup type (Lesson or Slideshow)
  };

  const handleLanguageSelect = (language) => {
    navigate(`/${popupType}/${language}`); // Navigate to the selected page and language
    setPopupType(null); // Hide the popup
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Menu</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><button onClick={() => handlePopupClick('lesson')} className="lesson-button">Lesson</button></li>
            <li><button onClick={() => handlePopupClick('slideshow')} className="lesson-button">Slideshow</button></li>
            <li><Link to="/donut">Donut</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Welcome to Learna1, your companion for A1 language learning.</h1>
        <p>Select a menu option to begin your journey!</p>
      </main>
      {popupType && (
        <div className="popup">
          <div className="popup-content">
            <h3>Select Language for {popupType.charAt(0).toUpperCase() + popupType.slice(1)}</h3>
            <button onClick={() => handleLanguageSelect('de')}>German</button>
            <button onClick={() => handleLanguageSelect('fr')}>French</button>
            <button onClick={() => setPopupType(null)} className="close-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
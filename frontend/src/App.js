import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/chat">Chat</Link>| <Link to="/lesson">Lesson</Link>
      </nav>
    </div>
  );
};

export default App;

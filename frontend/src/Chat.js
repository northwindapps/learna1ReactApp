import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default language (English)

  const [voices, setVoices] = useState([]);
  const [englishVoice, setEnglishVoice] = useState(null);

  useEffect(() => {
    // Function to load voices and update available voices list
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      const defaultVoice = availableVoices.find(voice => voice.lang === selectedLanguage);
      setEnglishVoice(defaultVoice);
    };

    loadVoices();

    // This event fires when voices are loaded/changed in the browser
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedLanguage]);

  // Speak text function with dynamic language selection
  function speakText(text, callback) {
    const voice = voices.find(voice => voice.lang === selectedLanguage);

    if ('speechSynthesis' in window && voice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;

      // Callback after speech has finished
      utterance.onend = () => {
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-Speech is not supported in this browser.");
    }
  }

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'You', text: input };
    setMessages([...messages, newMessage]);

    //'http://18.177.15.188:3001/chat'
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { sender: 'AI', text: data.reply, speakableText: data.reply }, // Add the text for later playback
        ];
        return updatedMessages;
      });

      // Speak the AI's response with the selected language
      speakText(data.reply); 
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'AI', text: 'Oops, something went wrong!' },
      ]);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="language-selector">
        <label htmlFor="language-select">Choose language: </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.lang}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'AI' ? 'incoming' : 'outgoing'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
            {msg.sender === 'AI' && msg.speakableText && (
              <button onClick={() => speakText(msg.speakableText)}>🔊 Playback</button>
            )}
          </div>
        ))}
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

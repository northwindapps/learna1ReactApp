import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
  const [vocab, setVocab] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState('de-DE'); // Default language (English)

  const [voices, setVoices] = useState([]);
  const [englishVoice, setEnglishVoice] = useState(null);

  // Shuffle function to randomize the order of vocabulary
  const shuffleArray = (array) => {
    let shuffledArray = [...array]; // Create a copy of the array to avoid mutating the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

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

  useEffect(() => {
    // Fetch the CSV file and parse it manually
    fetch('/germanVocab500A1&Examples.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split('\n'); // Split by line
        const parsedData = rows.map((row) => {
          
          // Use a regular expression to split by commas outside of quotes
          const regex = /(".*?"|[^",\n]+)(?=\s*,|\s*$)/g; 
          const columns = [...row.matchAll(regex)].map(match => match[0].replace(/(^"|"$)/g, '')); // Remove quotes
          
          // Now you can destructure the columns
          const [word, translation, example, example_translation] = columns;
            
          // Ensure both word and translation are present
          if (word && translation && example && example_translation) {
            return { word: word.replace(/"/g, ''), translation: translation.replace(/"/g, ''), example: example.replace(/"/g, ''), example_translation: example_translation.replace(/"/g, '') };
          }
          return null; // Return null for invalid rows
        }).filter(Boolean); // Filter out invalid rows
        // Shuffle the data to randomize the order
        const shuffledData = shuffleArray(parsedData);
        setVocab(shuffledData);
        console.log(parsedData);
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, []);

  const nextSlide = () => {
    if (currentIndex < vocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="slideshow-container">
      <h1>German Vocabulary Slideshow</h1>
      {vocab.length > 0 ? (
        <div className="slide">
          <div className="word">{vocab[currentIndex].word} <button onClick={() => speakText(vocab[currentIndex].word)}>🔊</button></div>
          <div className="translation">{vocab[currentIndex].translation}</div>
          <div className="word">{vocab[currentIndex].example} <button onClick={() => speakText(vocab[currentIndex].example)}>🔊</button></div>
          <div className="translation">{vocab[currentIndex].example_translation}</div>
          <div className="navigation">
            <button onClick={prevSlide} disabled={currentIndex === 0}>
              Previous
            </button>
            <button onClick={nextSlide} disabled={currentIndex === vocab.length - 1}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading vocabulary...</p>
      )}
    </div>
  );
};

export default Slideshow;

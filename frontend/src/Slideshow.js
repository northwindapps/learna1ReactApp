import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
    const [vocab, setVocab] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [selectedLanguage, setSelectedLanguage] = useState('de-DE'); // Default language (German)
    const [voices, setVoices] = useState([]);
    const [currentVoice, setCurrentVoice] = useState(null);

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
      const loadVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      setVoices(vs);
      var match = vs.find(v =>
        v.lang.toLowerCase().includes(selectedLanguage.toLowerCase())
      );

      const normalized = selectedLanguage.toLowerCase();
      if (!match) {
        // Fallback to primary subtag matching, e.g. "fr" from "fr-CA"
        const primary = normalized.split('-')[0];
        match = vs.find(v => v.lang.toLowerCase().startsWith(primary));
      }

      setCurrentVoice(match || vs[0] || null);
    };

    // Chrome fires this once voices are ready
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // Also try loading immediately in case voices are already available
    loadVoices();

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };

    // This event fires when voices are loaded/changed in the browser
    // window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedLanguage]);

  // Speak text function with dynamic language selection
  function speakText(text, callback) {
    if ('speechSynthesis' in window && currentVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = currentVoice;

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
    // Get language parameter from the URL query string
    const pathSegments = window.location.pathname.split('/');
    const languageFromUrl = pathSegments[pathSegments.length - 1] || 'de';
    console.log(languageFromUrl);
    switch (languageFromUrl) {
      case "de":
        setSelectedLanguage("de-DE");
        break;
    
      case "fr":
        setSelectedLanguage("fr-CA");
        break;
    
      default:
        setSelectedLanguage("de-DE");
        break;
    }
    
    

    // Fetch the CSV file based on the selected language and parse it
    fetch(`/vocab-${languageFromUrl}.csv`)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split('\n'); // Split by line
        const parsedData = rows.map((row) => {
          const regex = /(".*?"|[^",\n]+)(?=\s*,|\s*$)/g; 
          const columns = [...row.matchAll(regex)].map(match => match[0].replace(/(^"|"$)/g, '')); // Remove quotes
          
          const [word, translation, example, example_translation] = columns;
            
          if (word && translation && example && example_translation) {
            return { word: word.replace(/"/g, ''), translation: translation.replace(/"/g, ''), example: example.replace(/"/g, ''), example_translation: example_translation.replace(/"/g, '') };
          }
          return null; // Return null for invalid rows
        }).filter(Boolean); // Filter out invalid rows
        // Shuffle the data to randomize the order
        const shuffledData = shuffleArray(parsedData);
        setVocab(shuffledData);
        // console.log(parsedData);
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, [selectedLanguage]);

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
      <h1>Vocabulary Slideshow</h1>
      {vocab.length > 0 ? (
        <div className="slide">
          <div className="word">
            {vocab[currentIndex].word} <button onClick={() => speakText(vocab[currentIndex].word)}>🔊</button>
          </div>
          <div className="translation">{vocab[currentIndex].translation}</div>
          <div className="word">
            {vocab[currentIndex].example} <button onClick={() => speakText(vocab[currentIndex].example)}>🔊</button>
          </div>
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

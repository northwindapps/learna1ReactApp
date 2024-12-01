import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
  const [vocab, setVocab] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch the CSV file and parse it manually
    fetch('/germanVocab500A1.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split('\n'); // Split by line
        const parsedData = rows.map((row) => {
          const [word, translation] = row.split(','); // Split each row by comma

          // Ensure both word and translation are present
          if (word && translation) {
            return { word: word.replace(/"/g, ''), translation: translation.replace(/"/g, '') };
          }
          return null; // Return null for invalid rows
        }).filter(Boolean); // Filter out invalid rows
        setVocab(parsedData);
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
          <div className="word">{vocab[currentIndex].word}</div>
          <div className="translation">{vocab[currentIndex].translation}</div>
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

import React, { useState, useEffect } from 'react';
import './Lesson.css';

const Lesson = () => {
  const [vocab, setVocab] = useState([]);

  useEffect(() => {
    // Fetch the CSV file and parse it manually
    fetch('/germanVocab500A1&Examples.csv')
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

  return (
    <div className="lesson-container">
      <h1>German Vocabulary To-Do List</h1>
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Translation</th>
            <th>Learned</th>
          </tr>
        </thead>
        <tbody>
          {vocab.map((item, index) => (
            <tr key={index}>
              <td>{item.word}</td>
              <td>{item.translation}</td>
              <td>
                <input type="checkbox" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lesson;

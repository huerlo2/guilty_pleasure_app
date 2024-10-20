// src/App.js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBWDb-U4BstEtROtZkWKo9tTKi6SRfclDs',
  authDomain: 'guilty-pleasure-app.firebaseapp.com',
  projectId: 'guilty-pleasure-app',
  storageBucket: 'guilty-pleasure-app.appspot.com',
  messagingSenderId: '641322824277',
  appId: '1:641322824277:web:84914bdd0c07eca4229adc',
  measurementId: 'G-R4QZW2T19F',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db, collection, addDoc, onSnapshot };

import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, onSnapshot } from './firebase';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pleasures'), (snapshot) => {
      const updatedTexts = snapshot.docs.map((doc) => doc.data().text);
      setTexts(updatedTexts);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (inputText.trim()) {
      await addDoc(collection(db, 'pleasures'), { text: inputText });
      setInputText('');
      setIsInputOpen(false);
    }
  };

  return (
    <div className="App">
      <header>
        <div className="header-left">
          <h1>Guilty pleasure</h1>
          <button
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            &#9776;
          </button>
        </div>
        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>학교&직장</li>
            <li>일상</li>
            <li>음식</li>
            <li>덕질</li>
          </ul>
        </div>
        <button
          className="input-btn"
          onClick={() => setIsInputOpen(!isInputOpen)}
        >
          길티플레져 입력하기
        </button>
      </header>

      {isInputOpen && (
        <div className="input-popup">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="당신의 길티플레져를 입력하세요..."
          />
          <button onClick={handleSubmit}>저장</button>
        </div>
      )}

      <div className="texts-container">
        <div className="texts-wrapper">
          {texts.map((text, index) => (
            <div key={index} className="text-item">
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

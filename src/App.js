import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation/Navigation';
import DocumentCreator from './components/DocumentCreator/DocumentCreator';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <Router>
      <motion.div 
        className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
        <Routes>
          <Route path="/" element={<DocumentCreator />} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;

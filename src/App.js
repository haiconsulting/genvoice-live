import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation/Navigation';
import DocumentCreator from './components/DocumentCreator/DocumentCreator';
import TemplateGenerator from './components/TemplateGenerator/TemplateGenerator';
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
    <Router basename="/genvoice-live">
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
          <Route path="/template-generator" element={<TemplateGenerator />} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;

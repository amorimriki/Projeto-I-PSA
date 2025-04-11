import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/React_HomePage';
import PredictionForm from './components/React_PredictionForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction-form" element={<PredictionForm />} />
      </Routes>
    </Router>
  );
}

export default App;

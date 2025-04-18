import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/React_HomePage';
import PredictionForm from './components/React_PredictionForm';
import PredictionFile from './components/React_PredictionFile';
import FuncPage from'./components/React_FuncPage';
import AboutPage from './components/React_AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction-form" element={<PredictionForm />} />
        <Route path="/prediction-file" element={<PredictionFile />} />
        <Route path="/func-page" element={<FuncPage />} />
        <Route path="/about-page" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;

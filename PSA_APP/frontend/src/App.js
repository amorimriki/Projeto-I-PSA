import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/React_HomePage';
import PredictionForm from './pages/React_PredictionFormPage';
import PredictionFile from './pages/React_PredictionFilePage';
import FuncPage from'./pages/React_FuncPage';
import AboutPage from './pages/React_AboutPage';
import HistoryPage from './pages/React_HistoryPage';
import ChartsPage from './pages/React_ChartsPage';
import PersonalProgressPage from './pages/React_PersonProgresPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction-form" element={<PredictionForm />} />
        <Route path="/prediction-file" element={<PredictionFile />} />
        <Route path="/func-page" element={<FuncPage />} />
        <Route path="/about-page" element={<AboutPage />} />
        <Route path="/history-page" element={<HistoryPage />} />
        <Route path="/charts-page" element={<ChartsPage />} />
        <Route path="/person-progress-page" element={<PersonalProgressPage />} />
      </Routes>
    </Router>
  );
}

export default App;

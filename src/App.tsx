import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConfigPage from './pages/ConfigPage';
import OutputPage from './pages/OutputPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/" element={<ConfigPage />} />
          <Route path="/output" element={<OutputPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
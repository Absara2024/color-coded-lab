import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </React.Suspense>
  );
};

export default App;
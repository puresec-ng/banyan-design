import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Portal from './pages/Portal';
import SubmitClaim from './pages/SubmitClaim';
import './css/styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 
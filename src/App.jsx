// src/App.js
import '@/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioPage from '@page/Admin';
import HomePage from '@page/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;

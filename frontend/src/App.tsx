import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { RecipeDetail } from './pages/RecipeDetail';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand-wrapper">
          <Link to="/" className="nav-brand">
            🍽️ Protein Pantry
          </Link>
          <p className="nav-subtitle">Your veggie protein power-up station</p>
        </div>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Ingredients
            </Link>
          </li>
          <li>
            <Link
              to="/recipes"
              className={`nav-link ${location.pathname.startsWith('/recipes') ? 'active' : ''}`}
            >
              Recipes
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          Developed by Virtee & Manan • Inspired by{' '}
          <a 
            href="https://what-the-whey.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            what-the-whey
          </a>
        </p>
        <p className="footer-disclaimer">
          This is not medical advice. Created for the developer's personal use only.
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

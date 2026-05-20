import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import MovementForm from './components/MovementForm';
import StockDashboard from './components/StockDashboard';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#1a365d', color: 'white', padding: '16px 24px', borderRadius: '8px', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>
            🏭 DIGITRANS-CM — Module Supply Chain
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.8 }}>
            AGROCAM S.A. · Gestion des flux de marchandises
          </p>
        </header>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <Link to="/" style={navStyle}>📊 Tableau de bord</Link>
          <Link to="/products" style={navStyle}>📦 Produits</Link>
          <Link to="/movements" style={navStyle}>🔄 Mouvement de stock</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<StockDashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/movements" element={<MovementForm />} />
        </Routes>
      </div>
    </Router>
  );
}

const navStyle = {
  padding: '8px 16px',
  backgroundColor: '#2b6cb0',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
};

export default App;

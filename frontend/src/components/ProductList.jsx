import { useState, useEffect } from 'react';
import { productApi } from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', unit: 'kg', alertThreshold: 100
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Erreur chargement produits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await productApi.create(newProduct);
    setNewProduct({ name: '', category: '', unit: 'kg', alertThreshold: 100 });
    loadProducts();
  };

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div>
      <h2>📦 Gestion des Produits</h2>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3>Ajouter un produit</h3>
        <input placeholder="Nom (ex: Cacao Grade A)" value={newProduct.name}
          onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={inputStyle} />
        <input placeholder="Catégorie (ex: CACAO)" value={newProduct.category}
          onChange={e => setNewProduct({...newProduct, category: e.target.value})} required style={inputStyle} />
        <input placeholder="Unité (ex: kg)" value={newProduct.unit}
          onChange={e => setNewProduct({...newProduct, unit: e.target.value})} style={inputStyle} />
        <input type="number" placeholder="Seuil alerte" value={newProduct.alertThreshold}
          onChange={e => setNewProduct({...newProduct, alertThreshold: parseInt(e.target.value)})} style={inputStyle} />
        <button type="submit" style={btnStyle}>Ajouter</button>
      </form>

      {/* Tableau des produits */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ backgroundColor: '#2b6cb0', color: 'white' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Catégorie</th>
            <th style={thStyle}>Unité</th>
            <th style={thStyle}>Seuil Alerte</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.category}</td>
              <td style={tdStyle}>{p.unit}</td>
              <td style={tdStyle}>{p.alertThreshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formStyle = { backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' };
const inputStyle = { padding: '8px', marginRight: '8px', marginBottom: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' };
const btnStyle = { padding: '8px 16px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const thStyle = { padding: '10px 12px', textAlign: 'left' };
const tdStyle = { padding: '10px 12px' };

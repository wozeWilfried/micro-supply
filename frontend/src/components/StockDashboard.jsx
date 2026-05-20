import { useState, useEffect } from 'react';
import { productApi, warehouseApi, stockApi } from '../services/api';

export default function StockDashboard() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stockMatrix, setStockMatrix] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const [prodsRes, whsRes] = await Promise.all([
      productApi.getAll(),
      warehouseApi.getAll()
    ]);
    const prods = prodsRes.data;
    const whs = whsRes.data;
    setProducts(prods);
    setWarehouses(whs);

    // Construire la matrice stock[productId][warehouseId]
    const matrix = {};
    for (const p of prods) {
      matrix[p.id] = {};
      for (const w of whs) {
        try {
          const res = await stockApi.getCurrent(p.id, w.id);
          matrix[p.id][w.id] = res.data.currentStock;
        } catch {
          matrix[p.id][w.id] = 0;
        }
      }
    }
    setStockMatrix(matrix);
    Loading(false);
  };

  if (loading) return <div style={{ padding: '20px' }}>⏳ Chargement du tableau de bord...</div>;

  return (
    <div>
      <h2>📊 Tableau de Bord — Stock Courant</h2>
      <p style={{ color: '#718096', fontSize: '13px' }}>
        🔴 Stock critique (en dessous du seuil) · 🟢 Stock normal
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a365d', color: 'white' }}>
              <th style={thStyle}>Produit</th>
              <th style={thStyle}>Catégorie</th>
              <th style={thStyle}>Seuil Alerte</th>
              {warehouses.map(w => (
                <th key={w.id} style={thStyle}>{w.name}<br/><small>{w.city}</small></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}><strong>{product.name}</strong></td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>{product.alertThreshold} {product.unit}</td>
                {warehouses.map(warehouse => {
                  const stock = stockMatrix[product.id]?.[warehouse.id] ?? 0;
                  const isCritical = stock <= product.alertThreshold;
                  return (
                    <td key={warehouse.id} style={{
                      ...tdStyle,
                      backgroundColor: isCritical ? '#fff5f5' : '#f0fff4',
                      color: isCritical ? '#c53030' : '#276749',
                      fontWeight: isCritical ? 'bold' : 'normal',
                      textAlign: 'center'
                    }}>
                      {isCritical ? '🔴' : '🟢'} {stock} {product.unit}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={loadDashboard} style={{ marginTop: '16px', padding: '8px 16px',
        backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        🔄 Actualiser
      </button>
    </div>
  );
}

const thStyle = { padding: '10px 12px', textAlign: 'left', fontWeight: '600' };
const tdStyle = { padding: '10px 12px' };

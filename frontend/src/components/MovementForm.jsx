import { useState, useEffect } from 'react';
import { productApi, warehouseApi, movementApi } from '../services/api';

export default function MovementForm() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [movement, setMovement] = useState({
    product: { id: '' },
    sourceWarehouse: { id: '' },
    destinationWarehouse: { id: '' },
    quantity: 1,
    movementType: 'TRANSFER',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    productApi.getAll().then(r => setProducts(r.data));
    warehouseApi.getAll().then(r => setWarehouses(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await movementApi.create(movement);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Erreur lors de l\'enregistrement du mouvement');
    }
  };

  return (
    <div>
      <h2>🔄 Enregistrer un Mouvement de Stock</h2>
      {success && <div style={{ backgroundColor: '#c6f6d5', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
        ✅ Mouvement enregistré avec succès !
      </div>}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>Type de mouvement :</label>
          <select value={movement.movementType}
            onChange={e => setMovement({...movement, movementType: e.target.value})}
            style={{ ...inputStyle, marginLeft: '8px' }}>
            <option value="IN">📥 Entrée (Réception)</option>
            <option value="OUT">📤 Sortie (Expédition)</option>
            <option value="TRANSFER">🔄 Transfert inter-entrepôts</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Produit :</label>
          <select value={movement.product.id}
            onChange={e => setMovement({...movement, product: { id: e.target.value }})}
            required style={{ ...inputStyle, marginLeft: '8px' }}>
            <option value="">-- Sélectionner --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {movement.movementType !== 'IN' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Entrepôt source :</label>
            <select value={movement.sourceWarehouse.id}
              onChange={e => setMovement({...movement, sourceWarehouse: { id: e.target.value }})}
              style={{ ...inputStyle, marginLeft: '8px' }}>
              <option value="">-- Aucun --</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
            </select>
          </div>
        )}

        {movement.movementType !== 'OUT' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Entrepôt destination :</label>
            <select value={movement.destinationWarehouse.id}
              onChange={e => setMovement({...movement, destinationWarehouse: { id: e.target.value }})}
              style={{ ...inputStyle, marginLeft: '8px' }}>
              <option value="">-- Aucun --</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label>Quantité :</label>
          <input type="number" min="1" value={movement.quantity}
            onChange={e => setMovement({...movement, quantity: parseInt(e.target.value)})}
            required style={{ ...inputStyle, marginLeft: '8px', width: '80px' }} />
        </div>

        <button type="submit" style={btnStyle}>Enregistrer le mouvement</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#276749', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' };

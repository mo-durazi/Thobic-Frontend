import { useEffect, useState } from 'react';
import { getMyMaterials, deleteMaterial, updateMaterial } from '../../services/materialService';
import { useNavigate } from 'react-router';

import './MyMaterials.css';

const MyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await getMyMaterials();
        setMaterials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  if (loading) {
    return (
      <main className="my-materials-page">
        <div className="materials-loading">
          Loading materials...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-materials-page">
        <div className="materials-error">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="my-materials-page">
      <div className="my-materials-header">
        <div>
          <h1 className="my-materials-title">
            My Materials
          </h1>

          <p className="my-materials-subtitle">
            Manage your materials and stock availability.
          </p>
        </div>

        <button
          type="button"
          className="add-material-button"
          onClick={() => navigate('/materials/new')}
        >
          Add Material
        </button>
      </div>

      {feedback && <p className={`materials-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}

      {materials.length === 0 ? (
        <div className="materials-empty">
          <h2>No materials yet</h2>

          <p>
            Add your first material to start managing your stock.
          </p>
        </div>
      ) : (
        <div className="materials-table-wrapper">
          <table className="materials-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>
                    <div className="material-info">
                      {material.image_url ? (
                        <img
                          className="material-image"
                          src={material.image_url}
                          alt={material.name}
                        />
                      ) : (
                        <div className="material-image-placeholder">
                          No image
                        </div>
                      )}

                      <p className="material-name">
                        {material.name}
                      </p>
                    </div>
                  </td>

                  <td>
                    <span className="material-price">
                      {material.price}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`material-availability ${
                        material.is_available
                          ? 'available'
                          : 'unavailable'
                      }`}
                    >
                      <span className="availability-dot" />

                      {material.is_available
                        ? 'Available'
                        : 'Unavailable'}
                    </span>
                  </td>

                  <td>
                    <div className="material-actions">
                      <button
                        type="button"
                        className="material-action-button"
                        onClick={() => navigate(`/materials/${material.id}/edit`)}
                      >
                        Edit
                      </button>

                      {confirmingDeleteId === material.id ? (
                        <>
                          <span className="material-delete-confirm">Delete {material.name}?</span>
                          <button type="button" className="material-action-button delete" onClick={async () => {
                            setFeedback(null);
                            try {
                              await deleteMaterial(material.id);
                              setMaterials((items) => items.filter((item) => item.id !== material.id));
                              setConfirmingDeleteId(null);
                              setFeedback({ type: 'success', message: 'Material deleted.' });
                            } catch (err) {
                              setFeedback({ type: 'error', message: err.message || 'Could not delete material.' });
                            }
                          }}>Confirm</button>
                          <button type="button" className="material-action-button" onClick={() => setConfirmingDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button type="button" className="material-action-button delete" onClick={() => { setFeedback(null); setConfirmingDeleteId(material.id); }}>Delete</button>
                      )}
                      <button type="button" className="material-action-button" onClick={async () => {
                        try { await updateMaterial(material.id, { ...material, is_available: !material.is_available }); setMaterials((items) => items.map((item) => item.id === material.id ? { ...item, is_available: !item.is_available } : item)); }
                        catch (err) { setFeedback({ type: 'error', message: err.message || 'Could not update material availability.' }); }
                      }}>{material.is_available ? 'Mark unavailable' : 'Mark available'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default MyMaterials;

import { useEffect, useState } from 'react';
import { getMyMaterials } from '../../services/materialService';

import './MyMaterials.css';

const MyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        >
          Add Material
        </button>
      </div>

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
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="material-action-button delete"
                      >
                        Delete
                      </button>
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
import { useEffect, useState } from 'react';

import {
  getMyMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  uploadMaterialImage,
} from '../../services/materialService';

import './MaterialsManager.css';

const initialFormData = {
  name: '',
  colour: '',
  price: '',
  description: '',
  texture: 'smooth',
  pattern: 'plain',
  season: 'all_seasons',
  stand: 'stand',
  lead_time_days: '',
  is_available: true,
  image_url: '',
};

const MaterialsManager = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchMyMaterials = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyMaterials();

      setMaterials(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview('');
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
    setError('');
  };

  const handleOpenEdit = (material) => {
    setIsEditing(true);
    setCurrentId(material.id);

    setFormData({
      name: material.name || '',
      colour: material.colour || '',
      price: material.price ?? '',
      description: material.description || '',
      texture: material.texture || 'smooth',
      pattern: material.pattern || 'plain',
      season: material.season || 'all_seasons',
      stand: material.stand || 'stand',
      lead_time_days: material.lead_time_days ?? '',
      is_available: material.is_available ?? true,
      image_url: material.image_url || '',
    });

    setImageFile(null);
    setImagePreview(material.image_url || '');
    setShowForm(true);
    setError('');
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setError('');
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadResponse = await uploadMaterialImage(imageFile);
        imageUrl = uploadResponse.image_url;
      }

      const materialData = {
        name: formData.name.trim(),
        colour: formData.colour.trim(),
        price: Number(formData.price),
        description: formData.description.trim() || null,
        texture: formData.texture,
        pattern: formData.pattern,
        season: formData.season,
        stand: formData.stand,
        lead_time_days:
          formData.lead_time_days !== ''
            ? Number(formData.lead_time_days)
            : null,
        is_available: formData.is_available,
        image_url: imageUrl || null,
      };

      if (isEditing) {
        await updateMaterial(currentId, materialData);
      } else {
        await createMaterial(materialData);
      }

      await fetchMyMaterials();

      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');

      await deleteMaterial(id);
      setConfirmingDeleteId(null);

      await fetchMyMaterials();
    } catch (err) {
      setError(err.message || 'Failed to delete material.');
    }
  };

  const toggleAvailability = async (material) => {
    try {
      setError('');

      await updateMaterial(material.id, {
        name: material.name,
        colour: material.colour,
        price: material.price,
        description: material.description,
        texture: material.texture,
        pattern: material.pattern,
        season: material.season,
        stand: material.stand,
        lead_time_days: material.lead_time_days,
        is_available: !material.is_available,
        image_url: material.image_url,
      });

      await fetchMyMaterials();
    } catch (err) {
      setError(
        err.message || 'Failed to update material availability.'
      );
    }
  };

  if (loading) {
    return (
      <main className="materials-manager-page">
        <div className="materials-manager-message">
          Loading your materials...
        </div>
      </main>
    );
  }

  return (
    <main className="materials-manager-page">
      <div className="materials-manager-container">
        <div className="materials-manager-header">
          <div>
            <h1 className="materials-manager-title">
              Manage My Materials
            </h1>

            <p className="materials-manager-subtitle">
              Add, update, and manage your material inventory.
            </p>
          </div>

          <button
            type="button"
            className="materials-add-button"
            onClick={handleOpenAdd}
          >
            + Add Material
          </button>
        </div>

        {error && (
          <div className="materials-manager-error">
            {error}
          </div>
        )}

        {showForm && (
          <section className="material-form-card">
            <div className="material-form-header">
              <div>
                <h2>
                  {isEditing
                    ? 'Edit Material'
                    : 'Add New Material'}
                </h2>

                <p>
                  Enter the material information below.
                </p>
              </div>

              <button
                type="button"
                className="material-form-close"
                onClick={handleCloseForm}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              className="material-form"
              onSubmit={handleSubmit}
            >
              <div className="material-form-grid">
                <div className="material-field">
                  <label htmlFor="name">
                    Material Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="material-field">
                  <label htmlFor="colour">
                    Colour
                  </label>

                  <input
                    id="colour"
                    name="colour"
                    type="text"
                    value={formData.colour}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="material-field">
                  <label htmlFor="price">
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="material-field">
                  <label htmlFor="lead_time_days">
                    Lead Time (Days)
                  </label>

                  <input
                    id="lead_time_days"
                    name="lead_time_days"
                    type="number"
                    min="0"
                    value={formData.lead_time_days}
                    onChange={handleChange}
                  />
                </div>

                <div className="material-field">
                  <label htmlFor="texture">
                    Texture
                  </label>

                  <select
                    id="texture"
                    name="texture"
                    value={formData.texture}
                    onChange={handleChange}
                    required
                  >
                    <option value="smooth">Smooth</option>
                    <option value="rough">Rough</option>
                  </select>
                </div>

                <div className="material-field">
                  <label htmlFor="pattern">
                    Pattern
                  </label>

                  <select
                    id="pattern"
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                    required
                  >
                    <option value="plain">Plain</option>
                    <option value="patterned">Patterned</option>
                  </select>
                </div>

                <div className="material-field">
                  <label htmlFor="season">
                    Season
                  </label>

                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="all_seasons">
                      All Seasons
                    </option>
                    <option value="spring">Spring</option>
                  </select>
                </div>

                <div className="material-field">
                  <label htmlFor="stand">
                    Stand
                  </label>

                  <select
                    id="stand"
                    name="stand"
                    value={formData.stand}
                    onChange={handleChange}
                    required
                  >
                    <option value="stand">Stand</option>
                    <option value="half_stand">
                      Half Stand
                    </option>
                    <option value="loose">Loose</option>
                  </select>
                </div>
              </div>

              <div className="material-field">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="material-field">
                <label htmlFor="material-image">
                  Material Image
                </label>

                <input
                  id="material-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {imagePreview && (
                  <div className="material-image-preview">
                    <img
                      src={imagePreview}
                      alt="Material preview"
                    />
                  </div>
                )}
              </div>

              <div className="material-availability-field">
                <input
                  id="is_available"
                  name="is_available"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      is_available:
                        event.target.checked,
                    }))
                  }
                />

                <label htmlFor="is_available">
                  Available for clients to order
                </label>
              </div>

              <div className="material-form-actions">
                <button
                  type="button"
                  className="material-cancel-button"
                  onClick={handleCloseForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="material-save-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : isEditing
                      ? 'Save Changes'
                      : 'Create Material'}
                </button>
              </div>
            </form>
          </section>
        )}

        {materials.length === 0 ? (
          <div className="materials-empty-state">
            <h2>No Materials Yet</h2>

            <p>
              Add your first material to start managing
              your inventory.
            </p>

            {!showForm && (
              <button
                type="button"
                className="materials-empty-button"
                onClick={handleOpenAdd}
              >
                Add Your First Material
              </button>
            )}
          </div>
        ) : (
          <div className="materials-table-wrapper">
            <table className="materials-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Colour</th>
                  <th>Price</th>
                  <th>Season</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {materials.map((material) => (
                  <tr key={material.id}>
                    <td>
                      <div className="material-table-info">
                        {material.image_url ? (
                          <img
                            src={material.image_url}
                            alt={material.name}
                            className="material-table-image"
                          />
                        ) : (
                          <div className="material-table-placeholder">
                            No image
                          </div>
                        )}

                        <span>
                          {material.name}
                        </span>
                      </div>
                    </td>

                    <td>{material.colour}</td>

                    <td>
                      {material.price}
                    </td>

                    <td>
                      {material.season}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`material-status ${
                          material.is_available
                            ? 'available'
                            : 'unavailable'
                        }`}
                        onClick={() =>
                          toggleAvailability(material)
                        }
                      >
                        <span className="status-dot" />

                        {material.is_available
                          ? 'Available'
                          : 'Unavailable'}
                      </button>
                    </td>

                    <td>
                      <div className="material-actions">
                        <button
                          type="button"
                          className="material-edit-button"
                          onClick={() =>
                            handleOpenEdit(material)
                          }
                        >
                          Edit
                        </button>

                        {confirmingDeleteId === material.id ? (
                          <>
                            <span className="material-delete-confirm">Delete this material?</span>
                            <button type="button" className="material-delete-button" onClick={() => handleDelete(material.id)}>Confirm</button>
                            <button type="button" className="material-edit-button" onClick={() => setConfirmingDeleteId(null)}>Cancel</button>
                          </>
                        ) : (
                          <button type="button" className="material-delete-button" onClick={() => setConfirmingDeleteId(material.id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default MaterialsManager;

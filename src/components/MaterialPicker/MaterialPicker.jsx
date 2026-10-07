import { useEffect, useState } from 'react';

import { getMaterialLabel, MATERIAL_OPTIONS } from '../../lib/materialLabels';
import { getMaterials } from '../../services/materialService';
import MaterialDetailsModal from '../MaterialDetailsModal/MaterialDetailsModal';

import './MaterialPicker.css';

const SELECT_FILTERS = [
  { name: 'texture', label: 'Texture' },
  { name: 'pattern', label: 'Pattern' },
  { name: 'season', label: 'Season' },
  { name: 'stand', label: 'Stand' },
];

const EMPTY_FILTERS = {
  texture: '',
  pattern: '',
  season: '',
  stand: '',
  colour: '',
  min_price: '',
  max_price: '',
};

const getErrorMessage = (err) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ');
  if (typeof detail === 'string') return detail;

  return err?.message || 'Something went wrong loading materials.';
};

const MaterialPicker = ({ shopId, selectedMaterialId, onSelect }) => {
  const [sourceRole, setSourceRole] = useState('tailor');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterForm, setFilterForm] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [filterError, setFilterError] = useState('');
  const [detailsMaterial, setDetailsMaterial] = useState(null);

  useEffect(() => {
    const sourceFilter = sourceRole === 'tailor'
      ? { source_id: shopId, source_role: 'tailor' }
      : { source_role: 'provider' };

    const loadMaterials = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getMaterials({ ...sourceFilter, ...appliedFilters });
        setMaterials((data ?? []).filter((material) => material.is_available !== false));
      } catch (err) {
        setMaterials([]);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [shopId, sourceRole, appliedFilters]);

  const handleFilterChange = (event) => {
    setFilterForm({ ...filterForm, [event.target.name]: event.target.value });
  };

  const handleApply = () => {
    setFilterError('');

    const { min_price, max_price } = filterForm;
    if (min_price !== '' && max_price !== '' && Number(min_price) > Number(max_price)) {
      setFilterError("Min price can't be greater than max price.");
      return;
    }

    setAppliedFilters({ ...filterForm, colour: filterForm.colour.trim() });
  };

  // This panel sits inside the order <form>, so Enter must apply filters
  // instead of submitting the order.
  const handleFilterKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault();
      handleApply();
    }
  };

  const handleClear = () => {
    setFilterError('');
    setFilterForm(EMPTY_FILTERS);
    setAppliedFilters({ ...EMPTY_FILTERS });
  };

  const handleSelectFromModal = (material) => {
    onSelect(material);
    setDetailsMaterial(null);
  };

  const hasActiveFilters = Object.values(appliedFilters).some((value) => value !== '');

  const renderMaterials = () => {
    if (loading) {
      return <p className="material-picker-status">Loading materials...</p>;
    }

    if (error) {
      return <p className="material-picker-status material-picker-error">{error}</p>;
    }

    if (materials.length === 0) {
      return (
        <p className="material-picker-status">
          {hasActiveFilters
            ? 'No materials match these filters.'
            : sourceRole === 'tailor'
              ? 'This shop has no available materials.'
              : 'No provider fabrics are available right now.'}
        </p>
      );
    }

    return (
      <ul className="material-picker">
        {materials.map((material) => {
          const isSelected = material.id === selectedMaterialId;

          return (
            <li
              key={material.id}
              className={`material-card${isSelected ? ' selected' : ''}`}
              onClick={() => setDetailsMaterial(material)}
            >
              {material.image_url && (
                <img
                  className="material-card-image"
                  src={material.image_url}
                  alt={material.name}
                />
              )}

              <div className="material-card-info">
                <h3 className="material-card-name">{material.name}</h3>
                {material.colour && (
                  <p className="material-card-meta">
                    <strong>Colour:</strong> {material.colour}
                  </p>
                )}
                {material.texture && (
                  <p className="material-card-meta">
                    <strong>Texture:</strong> {getMaterialLabel('texture', material.texture)}
                  </p>
                )}
                {material.pattern && (
                  <p className="material-card-meta">
                    <strong>Pattern:</strong> {getMaterialLabel('pattern', material.pattern)}
                  </p>
                )}
                {material.source_name && (
                  <p className="material-card-source">
                    <strong>Source:</strong> {material.source_name}
                  </p>
                )}
                <p className="material-card-price">{material.price} BHD / metre</p>
              </div>

              <button
                type="button"
                className="secondary-button material-card-details-button"
                onClick={(event) => {
                  event.stopPropagation();
                  setDetailsMaterial(material);
                }}
              >
                View details
              </button>

              <button
                type="button"
                className="primary-button material-card-select-button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(material);
                }}
                disabled={isSelected}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="material-picker-container">
      <div className="material-source-tabs" role="tablist" aria-label="Fabric source">
        <button
          type="button"
          role="tab"
          id="material-tab-tailor"
          aria-selected={sourceRole === 'tailor'}
          aria-controls="material-tab-panel"
          className={`material-source-tab${sourceRole === 'tailor' ? ' active' : ''}`}
          onClick={() => setSourceRole('tailor')}
        >
          This shop's fabrics
        </button>
        <button
          type="button"
          role="tab"
          id="material-tab-provider"
          aria-selected={sourceRole === 'provider'}
          aria-controls="material-tab-panel"
          className={`material-source-tab${sourceRole === 'provider' ? ' active' : ''}`}
          onClick={() => setSourceRole('provider')}
        >
          Provider fabrics
        </button>
      </div>

      <div className="material-filters" onKeyDown={handleFilterKeyDown}>
        {SELECT_FILTERS.map(({ name, label }) => (
          <label
            key={name}
            className="material-filter-field"
            htmlFor={`material-filter-${name}`}
          >
            {label}
            <select
              className="material-filter-input"
              id={`material-filter-${name}`}
              name={name}
              value={filterForm[name]}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              {MATERIAL_OPTIONS[name].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="material-filter-field" htmlFor="material-filter-colour">
          Colour
          <input
            className="material-filter-input"
            id="material-filter-colour"
            type="text"
            name="colour"
            value={filterForm.colour}
            onChange={handleFilterChange}
          />
        </label>

        <label className="material-filter-field" htmlFor="material-filter-min-price">
          Min price
          <input
            className="material-filter-input"
            id="material-filter-min-price"
            type="number"
            name="min_price"
            min="0"
            step="0.1"
            value={filterForm.min_price}
            onChange={handleFilterChange}
          />
        </label>

        <label className="material-filter-field" htmlFor="material-filter-max-price">
          Max price
          <input
            className="material-filter-input"
            id="material-filter-max-price"
            type="number"
            name="max_price"
            min="0"
            step="0.1"
            value={filterForm.max_price}
            onChange={handleFilterChange}
          />
        </label>

        {filterError && <p className="material-filters-error">{filterError}</p>}

        <div className="material-filters-actions">
          <button type="button" className="primary-button" onClick={handleApply}>
            Apply
          </button>
          <button type="button" className="secondary-button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <div id="material-tab-panel" role="tabpanel" aria-labelledby={sourceRole === 'tailor' ? 'material-tab-tailor' : 'material-tab-provider'}>
        {renderMaterials()}
      </div>

      {detailsMaterial && (
        <MaterialDetailsModal
          material={detailsMaterial}
          isSelected={detailsMaterial.id === selectedMaterialId}
          onSelect={handleSelectFromModal}
          onClose={() => setDetailsMaterial(null)}
        />
      )}
    </div>
  );
};

export default MaterialPicker;

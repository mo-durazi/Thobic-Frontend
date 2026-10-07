import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { getMaterialLabel } from '../../lib/materialLabels';

import './MaterialDetailsModal.css';

const DETAIL_FIELDS = [
  { name: 'colour', label: 'Colour' },
  { name: 'texture', label: 'Texture' },
  { name: 'pattern', label: 'Pattern' },
  { name: 'season', label: 'Season' },
  { name: 'stand', label: 'Stand' },
];

const MaterialDetailsModal = ({ material, isSelected, onSelect, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const titleId = `material-details-title-${material.id}`;
  const hasLeadTime =
    material.lead_time_days !== null && material.lead_time_days !== undefined;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-box material-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        {material.image_url && (
          <img
            className="material-details-image"
            src={material.image_url}
            alt={material.name}
          />
        )}

        <h2 className="material-modal-title" id={titleId}>{material.name}</h2>

        <section className="material-details-info">
          {DETAIL_FIELDS.map(({ name, label }) =>
            material[name] ? (
              <p key={name} className="material-modal-attribute">
                <strong>{label}:</strong> {getMaterialLabel(name, material[name])}
              </p>
            ) : null,
          )}
          <p className="material-modal-price">
            <strong>Price:</strong> {material.price} BHD / metre
          </p>
          {material.source_name && (
            <p className="material-modal-attribute">
              <strong>Source:</strong> {material.source_name}
            </p>
          )}
          {hasLeadTime && (
            <p className="material-modal-attribute">
              <strong>Lead time:</strong> {material.lead_time_days}{' '}
              {material.lead_time_days === 1 ? 'day' : 'days'}
            </p>
          )}
          {material.description && (
            <p className="material-details-description">{material.description}</p>
          )}
        </section>

        <footer className="material-details-actions">
          <button
            type="button"
            className="primary-button material-modal-select"
            onClick={() => onSelect(material)}
            disabled={isSelected}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
          <button
            type="button"
            className="secondary-button material-modal-close"
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default MaterialDetailsModal;

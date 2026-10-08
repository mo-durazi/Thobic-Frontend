import { useEffect, useRef, useState } from 'react';
import './ShopPhotoPlaceholder.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ShopPhotoPlaceholder = ({
  className = '',
  description = 'Shop photo',
  editable = false,
  onFileSelect,
  imageUrl = '',
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect?.(file);
    event.target.value = '';
  };

  return (
    <div className={`shop-photo-picker ${className}`.trim()}>
      {editable ? (
        <>
          <button
            className={`shop-photo-placeholder shop-photo-picker-button ${className}`.trim()}
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            aria-label={`Choose ${description.toLowerCase()} from your computer`}
          >
            {previewUrl || imageUrl ? (
              <img className="shop-photo-preview" src={previewUrl || imageUrl} alt="Selected shop photo preview" />
            ) : (
              <span className="shop-photo-placeholder-icon" aria-hidden="true">IMG</span>
            )}
            <span>{previewUrl ? 'Change photo' : `Add ${description.toLowerCase()}`}</span>
            <small>Choose an image from your computer (max 5 MB)</small>
          </button>
          <input
            ref={inputRef}
            className="shop-photo-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            aria-label={`Select ${description.toLowerCase()}`}
          />
          {error && <p className="shop-photo-picker-error" role="alert">{error}</p>}
        </>
      ) : (
        <div className={`shop-photo-placeholder ${className}`.trim()} role="img" aria-label={`${description} placeholder`}>
          {imageUrl ? (
            <img className="shop-photo-preview" src={imageUrl} alt={`${description}`} />
          ) : (
            <>
              <span className="shop-photo-placeholder-icon" aria-hidden="true">IMG</span>
              <span>{description}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopPhotoPlaceholder;

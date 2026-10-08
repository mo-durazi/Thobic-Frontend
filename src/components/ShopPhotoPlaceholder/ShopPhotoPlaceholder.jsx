import './ShopPhotoPlaceholder.css';

const ShopPhotoPlaceholder = ({ className = '', description = 'Shop photo' }) => (
  <div className={`shop-photo-placeholder ${className}`.trim()} role="img" aria-label={`${description} placeholder`}>
    <span className="shop-photo-placeholder-icon" aria-hidden="true">IMG</span>
    <span>{description}</span>
  </div>
);

export default ShopPhotoPlaceholder;

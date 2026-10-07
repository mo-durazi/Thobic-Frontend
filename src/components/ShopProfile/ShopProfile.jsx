import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { getShopProfile } from '../../services/shopService';

import './ShopProfile.css';

const STATUS_LABELS = {
  open: 'Open',
  closed: 'Closed',
  busy: 'Busy',
}

const ShopProfile = () => {
  const { user } = useContext(UserContext);
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadShop = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getShopProfile(shopId);
        setShop(data);
      } catch (err) {
        setShop(null);
        setError(err?.message || 'Something went wrong loading this shop.');
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [shopId]);

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    navigate(`/shops/${shopId}/order`);
  };

  if (loading) {
    return (
      <main>
        <p>Loading shop...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/">Back to shops</Link>
      </main>
    );
  }

  if (!shop) {
    return (
      <main>
        <p>Shop not found.</p>
        <Link to="/">Back to shops</Link>
      </main>
    );
  }

  const { road_no, block_no, building_no } = shop.address ?? {};
  const addressParts = [
    building_no != null && `Building ${building_no}`,
    road_no != null && `Road ${road_no}`,
    block_no != null && `Block ${block_no}`,
  ].filter(Boolean);
  const canOrder = !user || user.role === 'client';

  return (
    <main className="shop-profile">
      <header className="shop-profile-header">
        <h1>{shop.display_name}</h1>

        {shop.status && (
          <span className={`shop-status shop-status-${shop.status}`}>
            {STATUS_LABELS[shop.status] ?? shop.status}
          </span>
        )}
      </header>

      <section className="shop-profile-info">
        {shop.branch && (
          <p>
            <strong>Branch:</strong> {shop.branch}
          </p>
        )}

        {addressParts.length > 0 && (
          <p>
            <strong>Address:</strong> {addressParts.join(', ')}
          </p>
        )}

        {shop.phone_number && (
          <p>
            <strong>Phone:</strong>{' '}
            <a href={`tel:${shop.phone_number}`}>{shop.phone_number}</a>
          </p>
        )}
      </section>

      <footer className="shop-profile-actions">
        <Link to="/">Back to shops</Link>

        {canOrder && (
          <button type="button" onClick={handlePlaceOrder}>
            Place an Order
          </button>
        )}
      </footer>
    </main>
  )
}

export default ShopProfile;

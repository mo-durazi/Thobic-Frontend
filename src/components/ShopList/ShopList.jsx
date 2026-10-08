import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { getShops } from '../../services/shopService';
import ShopPhotoPlaceholder from '../ShopPhotoPlaceholder/ShopPhotoPlaceholder';

import './ShopList.css';

const STATUS_LABELS = {
  open: 'Open',
  closed: 'Closed',
  busy: 'Busy',
};

const emptyFilters = { name: '', branch: '', status: '' };

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [formFilters, setFormFilters] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShops = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getShops(filters);
        setShops(data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [filters]);

  const handleChange = (evt) => {
    setFormFilters({ ...formFilters, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setFilters(formFilters);
  };

  const handleClear = () => {
    setFormFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  return (
    <main className="shop-list">
      <h1>Tailoring Shops</h1>

      <form className="shop-filters" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Shop name"
          value={formFilters.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formFilters.branch}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formFilters.status}
          onChange={handleChange}
        >
          <option value="">Any status</option>
          <option value="open">Open</option>
          <option value="busy">Busy</option>
          <option value="closed">Closed</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      {loading && <p>Loading shops...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && shops.length === 0 && (
        <p>No tailoring shops match your search.</p>
      )}

      {!loading && !error && shops.length > 0 && (
        <ul className="shop-cards">
          {shops.map((shop) => (
            <li key={shop.id} className="shop-card">
              <Link to={`/shops/${shop.id}`}>
                <ShopPhotoPlaceholder className="shop-photo-placeholder-card" />
                <div className="shop-card-header">
                  <h2>{shop.display_name ?? shop.username}</h2>

                  {shop.status && (
                    <span className={`shop-status shop-status-${shop.status}`}>
                      {STATUS_LABELS[shop.status] ?? shop.status}
                    </span>
                  )}
                </div>

                {shop.branch && <p>Branch: {shop.branch}</p>}

                <p>
                  Building {shop.building_no}, Road {shop.road_no}, Block{' '}
                  {shop.block_no}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ShopList;

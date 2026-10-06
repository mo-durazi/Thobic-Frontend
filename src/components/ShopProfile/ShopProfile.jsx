import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { getShopProfile } from '../../services/shopService';

import './ShopProfile.css';

const ShopProfile = () => {
  const { user } = useContext(UserContext);
  const { shopId } = useParams();
  const [shopProfile, setShopProfile] = useState(null);
  const navigate = useNavigate();

  return (
    <main className="shop-profile">
    
    </ main>
  )
}
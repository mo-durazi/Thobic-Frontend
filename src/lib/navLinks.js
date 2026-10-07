export const NAV_LINKS = {
  guest: [
    { to: '/', label: 'Home' },
    { to: '/shops', label: 'Tailors' },
    { to: '/#how-it-works', label: 'How It Works' },
  ],
  client: [
    { to: '/shops', label: 'Tailors' },
    { to: '/my-orders', label: 'My Orders' },
    { to: '/measurements', label: 'My Measurements' },
  ],
  tailor: [
    { to: '/tailor', label: 'Dashboard' },
    { to: '/tailor/orders', label: 'Orders' },
    { to: '/tailor/material-orders', label: 'Material Orders' },
    { to: '/materials/mine', label: 'My Materials' },
  ],
  provider: [
    { to: '/provider/orders', label: 'Orders' },
    { to: '/materials/mine', label: 'My Materials' },
  ],
  admin: [
    { to: '/admin/create-user', label: 'Create Account' },
  ],
};

export const getNavLinks = (user) =>
  user ? (NAV_LINKS[user.role] ?? []) : NAV_LINKS.guest;

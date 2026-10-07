export const ROLE_HOME = {
  client: '/shops',
  // TODO: change to '/tailor' when the tailor dashboard is merged
  tailor: '/tailor/orders',
  provider: '/provider/orders',
  admin: '/admin/create-user',
};

export const getRoleHome = (role) => ROLE_HOME[role] ?? '/';

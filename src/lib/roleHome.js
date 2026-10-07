export const ROLE_HOME = {
  client: '/shops',
  tailor: '/tailor',
  provider: '/provider/orders',
  admin: '/admin/create-user',
};

export const getRoleHome = (role) => ROLE_HOME[role] ?? '/';

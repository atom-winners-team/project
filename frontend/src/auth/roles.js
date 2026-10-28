export const USER_ROLES = {
  duty: 'duty',
  director: 'director',
  engineer: 'engineer',
};

export const ROLE_LABELS = {
  [USER_ROLES.duty]: 'Дежурный',
  [USER_ROLES.director]: 'Технический директор',
  [USER_ROLES.engineer]: 'Инженер',
};

export const hasRole = (role, ...allowedRoles) => allowedRoles.includes(role);

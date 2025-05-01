export type Permission = {
  id: number;
  action: string;
  description: string | null;
};

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'SUPPORT';

export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT'
} as const;

export const PERMISSIONS = {
  VIEW_PAYMENT_LINKS: 'VIEW_PAYMENT_LINKS',
  CREATE_PAYMENT_LINK: 'CREATE_PAYMENT_LINK',
  VIEW_TRANSACTIONS: 'VIEW_TRANSACTIONS',
  INVITE_TEAM_MEMBER: 'INVITE_TEAM_MEMBER',
  VIEW_TEAM_MEMBER: 'VIEW_TEAM_MEMBER',
  TOGGLE_TEAM_MEMBER: 'TOGGLE_TEAM_MEMBER',
  CREATE_WALLET: 'CREATE_WALLET',
  VIEW_WALLETS: 'VIEW_WALLETS',
  INITIATE_SINGLE_WITHDRAWAL: 'INITIATE_SINGLE_WITHDRAWAL',
  INITIATE_COUNTERPARTY_WITHDRAWAL: 'INITIATE_COUNTERPARTY_WITHDRAWAL',
  INITIATE_BULK_WITHDRAWAL: 'INITIATE_BULK_WITHDRAWAL',
  CREATE_COUNTERPARTY: 'CREATE_COUNTERPARTY',
  ADD_COUNTERPARTY_DETAILS: 'ADD_COUNTERPARTY_DETAILS',
  DELETE_COUNTERPARTY_DETAILS: 'DELETE_COUNTERPARTY_DETAILS',
  VIEW_COUNTER_PARTIES: 'VIEW_COUNTER_PARTIES',
  DELETE_COUNTERPARTY: 'DELETE_COUNTERPARTY',
  SWAP_CURRENCY: 'SWAP_CURRENCY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  CREATE_COLLECTIONS: 'CREATE_COLLECTIONS',
  VIEW_COLLECTIONS: 'VIEW_COLLECTIONS',
  UPDATE_COLLECTIONS: 'UPDATE_COLLECTIONS',
  DELETE_COLLECTIONS: 'DELETE_COLLECTIONS',
  CREATE_API_KEY: 'CREATE_API_KEY',
  VIEW_API_KEYS: 'VIEW_API_KEYS'

} as const;



export type PermissionAction = keyof typeof PERMISSIONS;

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  SUPERADMIN: Object.keys(PERMISSIONS) as PermissionAction[], // Full access
  ADMIN: Object.keys(PERMISSIONS).filter(permission => 
    permission !== 'CREATE_API_KEY' &&
    permission !== 'INVITE_TEAM_MEMBER'
  ) as PermissionAction[],
  SUPPORT: Object.keys(PERMISSIONS).filter(permission => 
    !permission.startsWith('CREATE_') && 
    !permission.startsWith('DELETE_') &&
    !permission.startsWith('UPDATE_') &&
    permission !== 'INVITE_TEAM_MEMBER' &&
    !permission.startsWith('VIEW_API_KEYS')
  ) as PermissionAction[]
};

export function hasPermission(userRole: UserRole, requiredPermission: PermissionAction): boolean {
  return ROLE_PERMISSIONS[userRole].includes(requiredPermission);
} 
// import { Permissions } from '@/enum/permissions.enum';
import { RoleName } from '../../../enum/role.enum';

export interface RoleSeed {
  id: string;
  name: RoleName;
}

export const ROLE_SEED_DATA: RoleSeed[] = [
  {
    id: '1a3c5c91-756e-488b-83e1-73ada0d3843d',
    name: RoleName.PM,
  },
  {
    id: '94e9344d-4445-41a8-a7d7-003956efcd1e',
    name: RoleName.TECH_LEAD,
  },
  {
    id: 'b84d88af-0297-4f17-8977-e7a0dc5ce7a2',
    name: RoleName.DEV,
  },
];

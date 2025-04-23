// import { Permissions } from '@/enum/permissions.enum';
import { RoleName } from '../../../enum/role.enum';

export interface RoleSeed {
  name: RoleName;
}

export const ROLE_SEED_DATA: RoleSeed[] = [
  {
    name: RoleName.PM,
  },
  {
    name: RoleName.TECH_LEAD,
  },
  {
    name: RoleName.DEV,
  },
];

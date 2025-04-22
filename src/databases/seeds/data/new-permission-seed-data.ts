// import { Permissions } from '@/enum/permissions.enum';
import { Permissions } from '../../../enum/permissions.enum';

export interface PermissionSeed {
  id: string;
  name: Permissions;
  path: string;
  method: string;
}

export const PERMISSION_SEED_DATA: PermissionSeed[] = [
  {
    id: '04d573a6-76ec-4307-acbc-587e9b501f0f',
    name: Permissions.CREATE_TASK,
    path: '/tasks',
    method: 'POST',
  },
  {
    id: '0c007cf3-45f0-4deb-9d47-d54395436574',
    name: Permissions.GET_TASK_BY_ID,
    path: '/tasks/:taskId',
    method: 'GET',
  },
  {
    id: '0d1e3469-7927-48e9-82c0-68b370e18de5',
    name: Permissions.GET_PROJECT_BY_ID,
    path: '/projects/:projectId',
    method: 'GET',
  },
  {
    id: '47c9e61c-cf0b-49c7-8a46-5b68198e527c',
    name: Permissions.MANAGE_ROLES,
    path: '/roles',
    method: 'ALL',
  },
  {
    id: '1f4fadb6-a2a3-4047-b571-ebd2be4cac52',
    name: Permissions.GET_PROJECTS,
    path: '/projects',
    method: 'GET',
  },
  {
    id: '29d68ce8-37ec-4877-895d-bf9d4ed4e31e',
    name: Permissions.DELETE_TASK,
    path: '/tasks/:projectId',
    method: 'DELETE',
  },
  {
    id: '2f5b3dfc-bf28-46ef-8343-ed45bca597e6',
    name: Permissions.MANAGE_PERMISSIONS,
    path: '/permissions',
    method: 'ALL',
  },
  {
    id: '3f30cf04-7340-4d37-a39a-0657ea3f3521',
    name: Permissions.ADD_PROJECT_MEMBERS,
    path: '/project/members',
    method: 'POST',
  },
  {
    id: '6a0ef22c-e252-453e-9db6-22fc42ba9417',
    name: Permissions.CREATE_CLIENT,
    path: '/clients',
    method: 'POST',
  },
  {
    id: '6c19b235-48ac-43b8-bd25-dbc2b0365d11',
    name: Permissions.GET_ALL_TASK_COMMENTS,
    path: '/comments/:id',
    method: 'GET',
  },
  {
    id: '6eb63764-6a36-41ea-8cdf-7ec84f06006c',
    name: Permissions.CREATE_TASK_COMMENT,
    path: '/comments',
    method: 'POST',
  },
  {
    id: '731d9259-3db7-4ea7-bcc7-ce0560bd102a',
    name: Permissions.ADD_TASK_MEMBERS,
    path: '/tasks/members',
    method: 'POST',
  },
  {
    id: '76750b7a-1247-4f4d-b6dc-c93b62884027',
    name: Permissions.REMOVE_TASK_MEMBERS,
    path: '/tasks/members',
    method: 'DELETE',
  },
  {
    id: '8e5776e4-af9c-4e7f-8bb1-b8cb450f49f1',
    name: Permissions.CREATE_PROJECT,
    path: '/projects',
    method: 'POST',
  },
  {
    id: 'bba87dbb-0a3a-4ceb-9f47-66959e020e59',
    name: Permissions.UPDATE_TASK_COMMENT,
    path: '/comments/:id',
    method: 'PUT',
  },
  {
    id: 'bbe62f72-5891-40d4-aa3a-1b44241c9b81',
    name: Permissions.GET_ALL_TASKS,
    path: '/tasks/:projectId',
    method: 'GET',
  },
  {
    id: 'c957dae7-ef8c-4d59-b17f-5ee97eb16ea9',
    name: Permissions.DELETE_TASK_COMMENT,
    path: '/comments/:id',
    method: 'DELETE',
  },
  {
    id: 'd028ac1a-7991-44ea-8581-8209fde20b71',
    name: Permissions.REMOVE_PROJECT_MEMBERS,
    path: '/project/members',
    method: 'DELETE',
  },
  {
    id: 'd1e895fd-93f3-49f4-9171-0f0fdea83955',
    name: Permissions.TEST_PERMISSION,
    path: '/test',
    method: 'GET',
  },
  {
    id: 'eedda914-c658-46c7-9905-d744434a5892',
    name: Permissions.CREATE_PERMISSION,
    path: '/permissions',
    method: 'POST',
  },
  {
    id: 'f94fade1-9e74-4c0c-aa6e-592bfc4ccd86',
    name: Permissions.UPDATE_TASK_STATUS,
    path: '/tasks/:taskId/status',
    method: 'PATCH',
  },
  {
    id: 'fc05c9f5-e204-475c-9173-ed93a485dcea',
    name: Permissions.UPDATE_TASK,
    path: '/tasks/:taskId',
    method: 'PATCH',
  },

  {
    id: 'd998dccb-6918-4e24-8b86-f2a875dd7eba',
    name: Permissions.UPDATE_PROJECT_MEMBERS,
    path: '/projects/members',
    method: 'PUT',
  },
];

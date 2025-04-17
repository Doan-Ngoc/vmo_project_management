import { Permissions } from '@/enum/permissions.enum';

interface PermissionData {
  name: string;
  path: string;
  method: string;
}

export const permissionsData: PermissionData[] = [
  {
    name: Permissions.CREATE_PERMISSION,
    path: '/permissions',
    method: 'POST',
  },
  {
    name: Permissions.CREATE_CLIENT,
    path: '/clients',
    method: 'POST',
  },
  {
    name: Permissions.MANAGE_ROLES,
    path: '/roles',
    method: 'ALL',
  },
  {
    name: Permissions.MANAGE_PERMISSIONS,
    path: '/permissions',
    method: 'ALL',
  },
  {
    name: Permissions.CREATE_PROJECT,
    path: '/projects',
    method: 'POST',
  },
  {
    name: Permissions.GET_PROJECT_BY_ID,
    path: '/projects/:id',
    method: 'GET',
  },
  {
    name: Permissions.GET_PROJECTS,
    path: '/projects',
    method: 'GET',
  },
  {
    name: Permissions.ADD_PROJECT_MEMBERS,
    path: '/projects/:id/members',
    method: 'POST',
  },
  {
    name: Permissions.REMOVE_PROJECT_MEMBERS,
    path: '/projects/:id/members',
    method: 'DELETE',
  },
  // Tasks
  {
    name: Permissions.CREATE_TASK,
    path: '/tasks',
    method: 'POST',
  },
  {
    name: Permissions.GET_TASK_BY_ID,
    path: '/tasks/:id',
    method: 'GET',
  },
  {
    name: Permissions.GET_ALL_TASKS,
    path: '/tasks',
    method: 'GET',
  },
  {
    name: Permissions.ADD_TASK_MEMBERS,
    path: '/tasks/:id/members',
    method: 'POST',
  },
  {
    name: Permissions.REMOVE_TASK_MEMBERS,
    path: '/tasks/:id/members',
    method: 'DELETE',
  },
  {
    name: Permissions.UPDATE_TASK,
    path: '/tasks/:id',
    method: 'PATCH',
  },
  {
    name: Permissions.UPDATE_TASK_STATUS,
    path: '/tasks/:id/status',
    method: 'PATCH',
  },
  {
    name: Permissions.DELETE_TASK,
    path: '/tasks/:id',
    method: 'DELETE',
  },
  {
    name: Permissions.CREATE_TASK_COMMENT,
    path: '/tasks/:id/comments',
    method: 'POST',
  },
  {
    name: Permissions.TEST_PERMISSION,
    path: '/test',
    method: 'GET',
  },
];

import { Permissions } from '../../../enum/permissions.enum';

export interface PermissionSeed {
  name: Permissions;
  path: string;
  method: string;
}

export const PERMISSION_SEED_DATA: PermissionSeed[] = [
  {
    name: Permissions.CREATE_TASK,
    path: '/tasks',
    method: 'POST',
  },
  {
    name: Permissions.GET_TASK_BY_ID,
    path: '/tasks/:taskId',
    method: 'GET',
  },
  {
    name: Permissions.GET_PROJECT_BY_ID,
    path: '/projects/:projectId',
    method: 'GET',
  },
  {
    name: Permissions.MANAGE_ROLES,
    path: '/roles',
    method: 'ALL',
  },
  {
    name: Permissions.GET_PROJECTS,
    path: '/projects',
    method: 'GET',
  },
  {
    name: Permissions.DELETE_TASK,
    path: '/tasks',
    method: 'DELETE',
  },
  {
    name: Permissions.MANAGE_PERMISSIONS,
    path: '/permissions',
    method: 'ALL',
  },
  {
    name: Permissions.ADD_PROJECT_MEMBERS,
    path: '/project/members',
    method: 'POST',
  },
  {
    name: Permissions.GET_ALL_TASK_COMMENTS,
    path: '/comments/tasks/:taskId',
    method: 'GET',
  },
  {
    name: Permissions.CREATE_TASK_COMMENT,
    path: '/comments',
    method: 'POST',
  },
  {
    name: Permissions.ADD_TASK_MEMBERS,
    path: '/tasks/members',
    method: 'POST',
  },
  {
    name: Permissions.REMOVE_TASK_MEMBERS,
    path: '/tasks/members',
    method: 'DELETE',
  },
  {
    name: Permissions.CREATE_PROJECT,
    path: '/projects',
    method: 'POST',
  },
  {
    name: Permissions.UPDATE_TASK_COMMENT,
    path: '/comments',
    method: 'PATCH',
  },
  {
    name: Permissions.GET_ALL_TASKS,
    path: '/tasks/:projectId',
    method: 'GET',
  },
  {
    name: Permissions.DELETE_TASK_COMMENT,
    path: '/comments',
    method: 'DELETE',
  },
  {
    name: Permissions.REMOVE_PROJECT_MEMBERS,
    path: '/project/members',
    method: 'DELETE',
  },
  {
    name: Permissions.TEST_PERMISSION,
    path: '/test',
    method: 'GET',
  },
  {
    name: Permissions.UPDATE_TASK_STATUS,
    path: '/tasks/status',
    method: 'PATCH',
  },
  {
    name: Permissions.UPDATE_TASK_DATA,
    path: '/tasks',
    method: 'PATCH',
  },
  {
    name: Permissions.UPDATE_PROJECT_MEMBERS,
    path: '/projects/members',
    method: 'PUT',
  },
  {
    name: Permissions.CREATE_WORKING_UNIT,
    path: '/working-units',
    method: 'POST',
  },
  {
    name: Permissions.GET_ALL_WORKING_UNITS,
    path: '/working-units',
    method: 'GET',
  },
  {
    name: Permissions.GET_WORKING_UNIT_BY_ID,
    path: '/working-units/:id',
    method: 'GET',
  },
  {
    name: Permissions.UPDATE_TASK_MEMBERS,
    path: '/tasks/members',
    method: 'PUT',
  },
  {
    name: Permissions.GET_ALL_CLIENTS,
    path: '/clients',
    method: 'GET',
  },
  {
    name: Permissions.CREATE_CLIENT,
    path: '/clients',
    method: 'POST',
  },
  {
    name: Permissions.UPDATE_PROJECT_STATUS,
    path: '/projects/status',
    method: 'PATCH',
  },
  {
    name: Permissions.CHANGE_PASSWORD,
    path: '/users/password',
    method: 'PATCH',
  },
  {
    name: Permissions.SEND_BULK_EMAIL,
    path: '/emails/bulk',
    method: 'POST',
  },
  {
    name: Permissions.GET_WORKING_UNIT_MEMBERS,
    path: '/working-units/:id/members',
    method: 'GET',
  },
  {
    name: Permissions.GET_CLIENT_BY_ID,
    path: '/clients/:id',
    method: 'GET',
  },
  {
    name: Permissions.GET_USER_BY_ID,
    path: '/users/:id',
    method: 'GET',
  },
  {
    name: Permissions.DOWNLOAD_TEMPLATE,
    path: '/users/download/user-import-template',
    method: 'GET',
  },
  {
    name: Permissions.UPDATE_ACCOUNT_STATUS,
    path: '/users/:id',
    method: 'PATCH',
  },
  {
    name: Permissions.DELETE_PROJECT,
    path: '/projects',
    method: 'DELETE',
  },

  {
    name: Permissions.GET_PROJECT_BY_WORKING_UNIT,
    path: '/projects/working-unit/:workingUnitId',
    method: 'GET',
  },

  {
    name: Permissions.UPDATE_USER_DATA,
    path: '/users/data',
    method: 'PATCH',
  },

  {
    name: Permissions.CREATE_COMMENT_REPLY,
    path: '/comments/replies',
    method: 'POST',
  },

  {
    name: Permissions.GET_COMMENT_REPLIES,
    path: '/comments/:commentId/replies',
    method: 'GET',
  },

  {
    name: Permissions.GET_TASK_COMMENT_BY_ID,
    path: '/comments/:commentId',
    method: 'GET',
  },
];

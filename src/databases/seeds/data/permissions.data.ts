import { Permissions } from '@/enum/permissions.enum';

interface PermissionData {
  name: string;
  path: string;
  method: string;
}

export const permissionsData: PermissionData[] = [
  {
    name: 'create_permission',
    path: '/permissions',
    method: 'POST',
  },
  {
    name: 'create_client',
    path: '/clients',
    method: 'POST',
  },
  {
    name: 'manage_roles',
    path: '/roles',
    method: 'ALL',
  },
  {
    name: 'manage_permissions',
    path: '/permissions',
    method: 'ALL',
  },
  {
    name: 'create_project',
    path: '/projects',
    method: 'POST',
  },
  {
    name: 'get_project_by_id',
    path: '/projects/:id',
    method: 'GET',
  },
  {
    name: 'get_projects',
    path: '/projects',
    method: 'GET',
  },
  {
    name: 'add_project_members',
    path: '/projects/:id/members',
    method: 'POST',
  },
  {
    name: 'remove_project_members',
    path: '/projects/:id/members',
    method: 'DELETE',
  },
  // Tasks
  {
    name: 'create_task',
    path: '/tasks',
    method: 'POST',
  },
  {
    name: 'get_task_by_id',
    path: '/tasks/:id',
    method: 'GET',
  },
  {
    name: 'get_all_tasks',
    path: '/tasks',
    method: 'GET',
  },
  {
    name: 'add_task_members',
    path: '/tasks/:id/members',
    method: 'POST',
  },
  {
    name: 'remove_task_members',
    path: '/tasks/:id/members',
    method: 'DELETE',
  },
  {
    name: 'update_task',
    path: '/tasks/:id',
    method: 'PATCH',
  },
  {
    name: 'update_task_status',
    path: '/tasks/:id/status',
    method: 'PATCH',
  },
  {
    name: 'delete_task',
    path: '/tasks/:id',
    method: 'DELETE',
  },
  {
    name: 'create_task_comment',
    path: '/comments',
    method: 'POST',
  },
  {
    name: 'get_task_comments',
    path: '/comments/:id',
    method: 'GET',
  },
  {
    name: 'update_task_comment',
    path: '/tasks/:id',
    method: 'PUT',
  },
  {
    name: 'delete_task_comment',
    path: '/comments/:id',
    method: 'DELETE',
  },
  {
    id: ""
    name: 'test_permission',
    path: '/test',
    method: 'GET',
  },
];

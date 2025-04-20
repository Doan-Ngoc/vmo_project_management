export enum Permissions {
  CREATE_PERMISSION = 'create_permission',
  CREATE_CLIENT = 'create_client',

  //rbac
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  // CREATE_ROLE = 'create_role',
  // GET_ROLE_BY_ID = 'get_role_by_id',
  // GET_ALL_ROLES = 'get_all_roles',
  // GET_ROLE_BY_NAME = 'get_role_by_name',
  // UPDATE_ROLE = 'update_role',
  // DELETE_ROLE = 'delete_role',

  // //rbac
  // GET_ROLE_PERMISSIONS = 'get_role_permissions',
  // ADD_PERMISSIONS_TO_ROLE = 'add_permissions_to_role',
  // REMOVE_PERMISSIONS_FROM_ROLE = 'remove_permissions_from_role'

  //projects
  CREATE_PROJECT = 'create_project',
  GET_PROJECT_BY_ID = 'get_project_by_id',
  GET_PROJECTS = 'get_projects',
  ADD_PROJECT_MEMBERS = 'add_project_members',
  REMOVE_PROJECT_MEMBERS = 'remove_project_members',

  //tasks
  CREATE_TASK = 'create_task',
  GET_TASK_BY_ID = 'get_task_by_id',
  GET_ALL_TASKS = 'get_all_tasks',
  ADD_TASK_MEMBERS = 'add_task_members',
  REMOVE_TASK_MEMBERS = 'remove_task_members',
  UPDATE_TASK = 'update_task',
  UPDATE_TASK_STATUS = 'update_task_status',
  DELETE_TASK = 'delete_task',

  //task comments
  CREATE_TASK_COMMENT = 'create_task_comment',
  GET_ALL_TASK_COMMENTS = 'get_all_task_comments',
  UPDATE_TASK_COMMENT = 'update_task_comment',
  DELETE_TASK_COMMENT = 'delete_task_comment',

  //test
  TEST_PERMISSION = 'test_permission',
}

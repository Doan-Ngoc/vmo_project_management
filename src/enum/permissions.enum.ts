export enum Permissions {
  CREATE_PERMISSION = 'create_permission',
  CREATE_CLIENT = 'create_client',

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
}

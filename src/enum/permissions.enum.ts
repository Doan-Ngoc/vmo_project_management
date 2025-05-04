export enum Permissions {
  //rbac
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',

  //users
  GET_USER_BY_ID = 'get_user_by_id',
  CREATE_USERS = 'create_users',
  UPLOAD_PROFILE_PICTURE = 'upload_profile_picture',
  UPDATE_USER_DATA = 'update_user_data',
  UPDATE_ACCOUNT_STATUS = 'update_account_status',
  CHANGE_PASSWORD = 'change_password',
  SEND_BULK_EMAIL = 'send_bulk_email',

  //projects
  CREATE_PROJECT = 'create_project',
  GET_PROJECT_BY_ID = 'get_project_by_id',
  GET_PROJECT_BY_WORKING_UNIT = 'get_project_by_working_unit',
  GET_PROJECTS = 'get_projects',
  ADD_PROJECT_MEMBERS = 'add_project_members',
  REMOVE_PROJECT_MEMBERS = 'remove_project_members',
  UPDATE_PROJECT_MEMBERS = 'update_project_members',
  UPDATE_PROJECT_STATUS = 'update_project_status',
  DELETE_PROJECT = 'delete_project',

  //tasks
  CREATE_TASK = 'create_task',
  GET_TASK_BY_ID = 'get_task_by_id',
  GET_ALL_TASKS = 'get_all_tasks',
  ADD_TASK_MEMBERS = 'add_task_members',
  REMOVE_TASK_MEMBERS = 'remove_task_members',
  UPDATE_TASK_DATA = 'update_task_data',
  UPDATE_TASK_STATUS = 'update_task_status',
  DELETE_TASK = 'delete_task',
  UPDATE_TASK_MEMBERS = 'update_task_members',

  //task comments
  CREATE_TASK_COMMENT = 'create_task_comment',
  GET_ALL_TASK_COMMENTS = 'get_all_task_comments',
  UPDATE_TASK_COMMENT = 'update_task_comment',
  DELETE_TASK_COMMENT = 'delete_task_comment',
  GET_COMMENT_REPLIES = 'get_comment_replies',
  GET_TASK_COMMENT_BY_ID = 'get_task_comment_by_id',
  CREATE_COMMENT_REPLY = 'create_comment_reply',

  //test
  TEST_PERMISSION = 'test_permission',

  //clients
  GET_ALL_CLIENTS = 'get_all_clients',
  GET_CLIENT_BY_ID = 'get_client_by_id',
  CREATE_CLIENT = 'create_client',

  //working units
  CREATE_WORKING_UNIT = 'create_working_unit',
  GET_ALL_WORKING_UNITS = 'get_all_working_units',
  GET_WORKING_UNIT_BY_ID = 'get_working_unit_by_id',
  GET_WORKING_UNIT_MEMBERS = 'get_working_unit_members',

  //file
  DOWNLOAD_TEMPLATE = 'download_template',
}

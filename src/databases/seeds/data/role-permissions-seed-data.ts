import { RoleName } from '../../../enum/role.enum';
import { Permissions } from '../../../enum/permissions.enum';
import { PermissionService } from '../../../modules/permissions/services/permission.service';
import { RoleService } from '../../../modules/roles/services/role.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolePermissionSeedData {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  async seedRolePermission() {
    const permissions = await this.permissionService.getAll();
    const roles = await this.roleService.getAll();
    const pmRoleId = roles.find((role) => role.name === RoleName.PM)?.id;
    const devRoleId = roles.find((role) => role.name === RoleName.DEV)?.id;
    const leadTechRoleId = roles.find(
      (role) => role.name === RoleName.TECH_LEAD,
    )?.id;

    const getPermissionId = (name: string) => {
      return (
        permissions.find((permission) => permission.name === name)?.id || ''
      );
    };

    return [
      {
        roleId: pmRoleId,
        permissionIds: [
          getPermissionId(Permissions.MANAGE_PERMISSIONS),
          getPermissionId(Permissions.MANAGE_ROLES),
          getPermissionId(Permissions.CREATE_CLIENT),
          getPermissionId(Permissions.CREATE_PROJECT),
          getPermissionId(Permissions.ADD_PROJECT_MEMBERS),
          getPermissionId(Permissions.REMOVE_PROJECT_MEMBERS),
          getPermissionId(Permissions.CREATE_TASK),
          getPermissionId(Permissions.GET_TASK_BY_ID),
          getPermissionId(Permissions.ADD_TASK_MEMBERS),
          getPermissionId(Permissions.REMOVE_TASK_MEMBERS),
          getPermissionId(Permissions.DELETE_TASK),
          getPermissionId(Permissions.GET_PROJECT_BY_ID),
          getPermissionId(Permissions.CREATE_TASK_COMMENT),
          getPermissionId(Permissions.UPDATE_TASK_COMMENT),
          getPermissionId(Permissions.DELETE_TASK_COMMENT),
          getPermissionId(Permissions.UPDATE_TASK_STATUS),
          getPermissionId(Permissions.UPDATE_TASK),
          getPermissionId(Permissions.GET_ALL_TASKS),
          getPermissionId(Permissions.GET_ALL_TASK_COMMENTS),
          getPermissionId(Permissions.TEST_PERMISSION),
          getPermissionId(Permissions.UPDATE_PROJECT_MEMBERS),
          getPermissionId(Permissions.GET_WORKING_UNIT_BY_ID),
          getPermissionId(Permissions.UPDATE_TASK_MEMBERS),
          getPermissionId(Permissions.GET_ALL_CLIENTS),
          getPermissionId(Permissions.UPDATE_PROJECT_STATUS),
          getPermissionId(Permissions.CHANGE_PASSWORD),
          getPermissionId(Permissions.GET_WORKING_UNIT_MEMBERS),
          getPermissionId(Permissions.GET_CLIENT_BY_ID),
          getPermissionId(Permissions.CREATE_WORKING_UNIT),
          getPermissionId(Permissions.GET_ALL_WORKING_UNITS),
          getPermissionId(Permissions.GET_USER_BY_ID),
          getPermissionId(Permissions.DELETE_PROJECT),
        ],
      },
      {
        roleId: devRoleId,
        permissionIds: [
          getPermissionId(Permissions.UPDATE_TASK_STATUS),
          getPermissionId(Permissions.UPDATE_TASK),
          getPermissionId(Permissions.GET_ALL_TASKS),
          getPermissionId(Permissions.GET_ALL_TASK_COMMENTS),
          getPermissionId(Permissions.CREATE_TASK_COMMENT),
          getPermissionId(Permissions.UPDATE_TASK_COMMENT),
          getPermissionId(Permissions.DELETE_TASK_COMMENT),
          getPermissionId(Permissions.GET_PROJECT_BY_ID),
          getPermissionId(Permissions.TEST_PERMISSION),
          getPermissionId(Permissions.GET_WORKING_UNIT_BY_ID),
          getPermissionId(Permissions.CHANGE_PASSWORD),
          getPermissionId(Permissions.GET_WORKING_UNIT_MEMBERS),
          getPermissionId(Permissions.GET_CLIENT_BY_ID),
          getPermissionId(Permissions.GET_USER_BY_ID),
        ],
      },
      {
        roleId: leadTechRoleId,
        permissionIds: [
          getPermissionId(Permissions.UPDATE_TASK_STATUS),
          getPermissionId(Permissions.UPDATE_TASK),
          getPermissionId(Permissions.GET_ALL_TASKS),
          getPermissionId(Permissions.GET_ALL_TASK_COMMENTS),
          getPermissionId(Permissions.CREATE_TASK_COMMENT),
          getPermissionId(Permissions.UPDATE_TASK_COMMENT),
          getPermissionId(Permissions.DELETE_TASK_COMMENT),
          getPermissionId(Permissions.GET_PROJECT_BY_ID),
          getPermissionId(Permissions.CREATE_TASK),
          getPermissionId(Permissions.ADD_TASK_MEMBERS),
          getPermissionId(Permissions.REMOVE_TASK_MEMBERS),
          getPermissionId(Permissions.TEST_PERMISSION),
          getPermissionId(Permissions.UPDATE_PROJECT_MEMBERS),
          getPermissionId(Permissions.GET_WORKING_UNIT_BY_ID),
          getPermissionId(Permissions.UPDATE_TASK_MEMBERS),
          getPermissionId(Permissions.CHANGE_PASSWORD),
          getPermissionId(Permissions.GET_WORKING_UNIT_MEMBERS),
          getPermissionId(Permissions.GET_CLIENT_BY_ID),
          getPermissionId(Permissions.GET_USER_BY_ID),
        ],
      },
    ];
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectStatus } from '../../../enum/project-status.enum';
import { Project } from '../entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { UserService } from '../../users/services/user.service';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkingUnitService } from '../../working-units/services/working-unit.service';
import { ClientService } from '../../clients/services/client.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate';
import { AccountStatus } from '../../../enum/account-status.enum';
import {
  CreateProjectDto,
  DeleteProjectDto,
  UpdateProjectMemberDto,
} from '../dtos';
import { DataSource } from 'typeorm';
import { RoleName } from '../../../enum/role.enum';
import { UpdateProjectStatusDto } from '../dtos/update-project-status.dto';
import { TaskStatus } from '../../../enum/task-status.enum';
import { Task } from '../../tasks/entities/task.entity';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitService: WorkingUnitService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, userId: string) {
    const { workingUnitId, clientId, dueDate, ...projectData } =
      createProjectDto;
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const workingUnit = await this.workingUnitService.getById(workingUnitId);
    const client = await this.clientService.getById(clientId);
    const user = await this.userService.getById(userId);
    const project = this.projectRepository.create({
      ...projectData,
      workingUnit,
      client,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdBy: user,
      status: ProjectStatus.ACTIVE,
      //If the creator is a project manager, add them as a project member (not if they are an admin)
      members: user.role?.name === 'pm' ? [user] : [],
    });
    return await this.projectRepository.save(project);
  }

  async getProjects(
    options: IPaginationOptions,
    query?: string,
  ): Promise<Pagination<Project>> {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    if (query) {
      queryBuilder.where('LOWER(project.name) LIKE :query', {
        query: `%${query.toLowerCase()}%`,
      });
    }
    queryBuilder
      .orderBy(
        `CASE 
     WHEN project.status = 'active' THEN 1
     WHEN project.status = 'completed' THEN 2
     WHEN project.status = 'cancelled' THEN 3
     ELSE 4
   END`,
      )
      .addOrderBy('project.createdAt', 'DESC');

    return paginate<Project>(queryBuilder, options);
  }

  async getById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workingUnit', 'members', 'members.role'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async getProjectByWorkingUnit(workingUnitId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { workingUnit: { id: workingUnitId } },
    });
  }

  async updateMembers(
    updateProjectMemberDto: UpdateProjectMemberDto,
    userId: string,
  ): Promise<Project> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { projectId, userIds } = updateProjectMemberDto;

    try {
      // Get the project and project members
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: projectId },
        relations: ['workingUnit', 'members', 'members.role'],
      });

      if (!project) {
        throw new NotFoundException(`Project not found`);
      }

      if (project.status !== ProjectStatus.ACTIVE) {
        throw new BadRequestException('Project is not active');
      }

      const currentMembers = project.members;
      const currentMemberIds = currentMembers.map((member) => member.id);

      // Check if the request sender is removing themselves
      const isIncluded = userIds.some((memberId) => memberId === userId);
      if (isIncluded) {
        throw new BadRequestException(
          'User cannot remove themselves from the project',
        );
      }

      //Separate users to add and remove
      const usersToAddIds = userIds.filter(
        (userId) => !currentMemberIds.includes(userId),
      );
      const usersToRemoveIds = userIds.filter((userId) =>
        currentMemberIds.includes(userId),
      );

      //Remove members
      const membersAfterRemove = currentMembers.filter(
        (member) => !usersToRemoveIds.includes(member.id),
      );

      //Add members
      let usersToAddData: User[] = [];
      for (const userId of usersToAddIds) {
        const user = await queryRunner.manager.findOne(User, {
          where: { id: userId },
          relations: ['role', 'workingUnit'],
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        //Check if user account is valid
        if (user.accountStatus !== AccountStatus.ACTIVE) {
          throw new BadRequestException(
            'One or more selected users are not active',
          );
        }
        if (user.workingUnit.id !== project.workingUnit.id) {
          throw new BadRequestException(
            'One or more users are not in the correct working unit',
          );
        }

        usersToAddData.push(user);
      }

      const membersAfterAdd = [...membersAfterRemove, ...usersToAddData];

      //Check if the number of members is within the limit
      const devNumber = membersAfterAdd.filter(
        (member) => member.role.name === RoleName.DEV,
      ).length;
      const pmNumber = membersAfterAdd.filter(
        (member) => member.role.name === RoleName.PM,
      ).length;
      const techLeadNumber = membersAfterAdd.filter(
        (member) => member.role.name === RoleName.TECH_LEAD,
      ).length;

      if (devNumber > project.devNumber) {
        throw new BadRequestException('Developer number limit exceeded');
      }
      if (pmNumber > project.pmNumber) {
        throw new BadRequestException('Project manager number limit exceeded');
      }
      if (techLeadNumber > project.techLeadNumber) {
        throw new BadRequestException('Tech lead number limit exceeded');
      }

      //Update the database
      project.members = membersAfterAdd;
      const updatedProject = await queryRunner.manager.save(Project, project);
      await queryRunner.commitTransaction();
      return updatedProject;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProjectStatus(
    updateProjectStatusDto: UpdateProjectStatusDto,
  ): Promise<Project> {
    const { projectId, status } = updateProjectStatusDto;
    const project = await this.getById(projectId);
    project.status = status;
    return await this.projectRepository.save(project);
  }

  async delete(deleteProjectDto: DeleteProjectDto, userId: string) {
    const { projectId, deletedReason } = deleteProjectDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get project with its tasks and each task's comments
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['tasks', 'tasks.comments'],
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      // Get the user who is deleting
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Update project status before deletion
      project.status = ProjectStatus.CANCELLED;
      project.deletedBy = user;
      project.deleted_reason = deletedReason;
      await queryRunner.manager.save(Project, project);

      // If project has tasks, handle their deletion
      if (project.tasks?.length > 0) {
        for (const task of project.tasks) {
          // First soft delete all comments of the task if they exist
          if (task.comments?.length > 0) {
            await queryRunner.manager.softRemove(task.comments);
          }

          // Update task status and mark who deleted it
          task.status = TaskStatus.CANCELLED;
          task.deletedBy = user;
          await queryRunner.manager.save(Task, task);

          // Then soft delete the task
          await queryRunner.manager.softRemove(task);
        }
      }

      // Finally soft delete the project
      await queryRunner.manager.softRemove(project);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Project deletion failed');
    } finally {
      await queryRunner.release();
    }
  }
}

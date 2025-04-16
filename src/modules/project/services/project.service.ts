import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectStatus } from '@/enum/project-status.enum';
import { Project } from '../entities/project.entity';
// import { CreateProjectDto } from '../dtos/create-project.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkingUnitService } from '../../working-unit/services/working-unit.service';
import { ClientService } from '../../client/services/client.service';
// import { AddProjectMemberDto } from '../dtos/add-project-member.dto';
// import { RemoveProjectMemberDto } from '../dtos/remove-project-member.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate';
import { AccountStatus } from '@/enum/account-status.enum';
import { AccountType } from '@/enum/account-type.enum';
import {
  CreateProjectDto,
  AddProjectMemberDto,
  RemoveProjectMemberDto,
} from '../dtos';
@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly workingUnitService: WorkingUnitService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

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

  async createProject(createProjectDto: CreateProjectDto, userId: string) {
    const { workingUnitId, clientId, dueDate, ...projectData } =
      createProjectDto;
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const workingUnit = await this.workingUnitService.getById(workingUnitId);
    const client = await this.clientService.getById(clientId);
    const user = await this.userService.getById(userId);
    if (user.accountType !== AccountType.ADMIN) {
      if (user.workingUnit.id !== workingUnitId) {
        throw new BadRequestException(
          'PM can only create projects for their own working unit',
        );
      }
    }
    try {
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
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Project name already exists');
      } else {
        throw new BadRequestException();
      }
    }
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

  async addMember(addProjectMemberDto: AddProjectMemberDto): Promise<Project> {
    const { projectId, userId } = addProjectMemberDto;
    const project = await this.getById(projectId);
    const user = await this.userService.getById(userId);
    //Check if user account is active
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new BadRequestException('User account is not active');
    }
    // Check if user is already a member
    if (project.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is already a member of this project');
    }
    // Check if user is a member of the working unit
    if (user.workingUnit.id !== project.workingUnit.id) {
      throw new BadRequestException(
        'User is not a member of this working unit',
      );
    }
    // Get user's role name
    const roleName = user.role.name;
    // Count current members of the same role
    const currentRoleMembers = project.members.filter(
      (member) => member.role.name === roleName,
    ).length;
    // Check if adding this member would exceed the limit
    if (roleName === 'dev' && currentRoleMembers >= project.devNumber) {
      throw new BadRequestException(
        `Cannot add more developers. Project already has ${project.devNumber} developers.`,
      );
    }
    if (roleName === 'pm' && currentRoleMembers >= project.pmNumber) {
      throw new BadRequestException(
        `Cannot add more project managers. Project already has ${project.pmNumber} project managers.`,
      );
    }
    if (
      roleName === 'tech_lead' &&
      currentRoleMembers >= project.techLeadNumber
    ) {
      throw new BadRequestException(
        `Cannot add more tech leads. Project already has ${project.techLeadNumber} tech leads.`,
      );
    }
    // Add the member
    project.members = [...project.members, user];
    return await this.projectRepository.save(project);
  }

  async removeMember(
    removeProjectMemberDto: RemoveProjectMemberDto,
  ): Promise<Project> {
    const { projectId, userId } = removeProjectMemberDto;
    const project = await this.getById(projectId);
    const user = await this.userService.getById(userId);

    // Check if user is a member of the project
    const isMember = project.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this project');
    }

    // Remove the member
    project.members = project.members.filter((member) => member.id !== user.id);
    return await this.projectRepository.save(project);
  }
}

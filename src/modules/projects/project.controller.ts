import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ProjectMember } from '../../decorators/project-member.decorator';
import {
  CreateProjectDto,
  UpdateProjectMemberDto,
  UpdateProjectStatusDto,
  DeleteProjectDto,
} from './dtos';
import { WorkingUnitMember } from '@/decorators/working-unit-member.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @WorkingUnitMember(Permissions.CREATE_PROJECT)
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectService.createProject(createProjectDto, user.id);
  }

  @Get(':projectId')
  @ProjectMember(Permissions.GET_PROJECT_BY_ID)
  getProjectById(@Param('projectId') id: string): Promise<Project> {
    return this.projectService.getById(id);
  }

  @Get('working-unit/:workingUnitId')
  @WorkingUnitMember(Permissions.GET_PROJECT_BY_WORKING_UNIT)
  getProjectByWorkingUnit(
    @Param('workingUnitId') id: string,
  ): Promise<Project[]> {
    return this.projectService.getProjectByWorkingUnit(id);
  }

  @Get()
  @Auth(Permissions.GET_PROJECTS)
  async getProjects(
    @Query('search') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ): Promise<Pagination<Project>> {
    limit = limit > 10 ? 10 : limit;
    const options: IPaginationOptions = {
      page,
      limit,
      route: '/projects',
    };
    return this.projectService.getProjects(options, query);
  }

  @Patch('/members')
  @ProjectMember(Permissions.UPDATE_PROJECT_MEMBERS)
  updateMembers(
    @Body() updateProjectMemberDto: UpdateProjectMemberDto,
    @GetUser() user: User,
  ) {
    return this.projectService.updateMembers(updateProjectMemberDto, user.id);
  }

  @Patch('/status')
  @ProjectMember(Permissions.UPDATE_PROJECT_STATUS)
  async updateProjectStatus(
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    return this.projectService.updateProjectStatus(updateProjectStatusDto);
  }

  @Delete()
  @ProjectMember(Permissions.DELETE_PROJECT)
  async deleteProject(
    @Body() deleteProjectDto: DeleteProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectService.delete(deleteProjectDto, user.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
// import { CreateProjectDto } from './dtos/create-project.dto';
// import { Auth } from 'src/decorators/auth.decorator';
// import { Permissions } from 'src/enum/permissions.enum';
// import { GetUser } from 'src/decorators/get-user.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';
// import { AddProjectMemberDto } from './dtos/add-project-member.dto';
import { ProjectMemberGuard } from '../../guards/project-member.guard';
// import { RemoveProjectMemberDto } from './dtos/remove-project-member.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ProjectMember } from '../../decorators/project-member.decorator';
import {
  CreateProjectDto,
  AddProjectMemberDto,
  RemoveProjectMemberDto,
  UpdateProjectMemberDto,
  UpdateProjectStatusDto,
} from './dtos';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Auth(Permissions.CREATE_PROJECT)
  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectService.createProject(createProjectDto, user.id);
  }

  @Get(':projectId')
  @UseGuards(ProjectMemberGuard)
  @Auth(Permissions.GET_PROJECT_BY_ID)
  getProjectById(@Param('projectId') id: string): Promise<Project> {
    return this.projectService.getById(id);
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

  @Put('/members')
  @ProjectMember(Permissions.UPDATE_PROJECT_MEMBERS)
  updateMembers(
    @Body() updateProjectMemberDto: UpdateProjectMemberDto,
    @GetUser() user: User,
  ) {
    return this.projectService.updateMembers(updateProjectMemberDto, user.id);
  }

  @Put('/status')
  @Auth(Permissions.UPDATE_PROJECT_STATUS)
  async updateProjectStatus(
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    return this.projectService.updateProjectStatus(updateProjectStatusDto);
  }
}

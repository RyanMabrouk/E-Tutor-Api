import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './infastructure/persistence/projects.repository';
import { NullableType } from 'src/utils/types/nullable.type';
import { Project } from './domain/project';
import { FilterProjectDto, SortProjectDto } from './dto/query-project.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { ValidateData } from 'src/utils/validation/vlalidate-data';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly validateData: ValidateData,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async create(createProject: CreateProjectDto): Promise<Project> {
    await this.validateData.vlaidateMembers(createProject.members);
    try {
      const created = await this.projectRepository.create(createProject);
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProjectDto | null;
    sortOptions?: SortProjectDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Project[]> {
    return this.projectRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: number): Promise<NullableType<Project>> {
    const item = await this.projectRepository.findOne({ id: id });
    return item;
  }

  async update(
    id: number,
    updateProject: UpdateProjectDto,
  ): Promise<Project | null> {
    if (updateProject.members) {
      await this.validateData.vlaidateMembers(updateProject.members);
    }
    try {
      const updated = await this.projectRepository.update(id, updateProject);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Project doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number) {
    await this.projectRepository.softDelete(id);
  }
}

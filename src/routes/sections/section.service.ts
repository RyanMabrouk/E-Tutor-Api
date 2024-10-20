import { CourseService } from './../courses/course.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { SectionRepository } from './infastructure/persistence/section.repository';
import { FilterSectionDto, SortSectionDto } from './dto/query-section.dto';
import { Section } from './domain/section';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { User } from '../users/domain/user';

@Injectable()
export class SectionService {
  constructor(
    private readonly sectionRepository: SectionRepository,
    private readonly courseService: CourseService,
  ) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    courseId,
  }: {
    filterOptions?: FilterSectionDto | null;
    sortOptions?: SortSectionDto[] | null;
    paginationOptions: IPaginationOptions;
    courseId: number;
  }): Promise<Section[]> {
    return this.sectionRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
      courseId,
    });
  }

  findOne({ id }: { id: number }): Promise<Section> {
    return this.sectionRepository.findOne({ id: id });
  }

  async create(data: CreateSectionDto, userId: User['id']): Promise<Section> {
    const course = await this.courseService.findOne({
      id: data.course.id,
    });
    if (!course.instructors.some((instructor) => instructor.id === userId)) {
      throw new ForbiddenException('User does not have access to this course');
    }
    return this.sectionRepository.create(data);
  }

  async update(
    { id, userId }: { id: number; userId: User['id'] },
    data: UpdateSectionDto,
  ): Promise<Section | null> {
    await this.validateUserHasAccess({ userId, sectionId: id });
    return this.sectionRepository.update(id, data);
  }

  async delete({
    id,
    userId,
  }: {
    id: Section['id'];
    userId: User['id'];
  }): Promise<void> {
    await this.validateUserHasAccess({ userId, sectionId: id });
    return this.sectionRepository.softDelete(id);
  }

  async validateUserHasAccess({
    userId,
    sectionId,
  }: {
    userId: User['id'];
    sectionId: Section['id'];
  }): Promise<void> {
    const section = await this.sectionRepository.findOne(
      {
        id: sectionId,
      },
      ['course'],
    );
    if (
      !section.course.instructors.some((instructor) => instructor.id === userId)
    ) {
      throw new ForbiddenException('User does not have access to this section');
    }
  }
}

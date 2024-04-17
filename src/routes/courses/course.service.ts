import { UsersService } from './../users/users.service';
import { FilesService } from './../files/files.service';
import { LanguageService } from './../languages/language.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CourseRepository } from './infastructure/persistence/course.repository';
import { FilterCourseDto, SortCourseDto } from './dto/query-course.dto';
import { Course } from './domain/course';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CategoriesService } from '../categories/categories.service';
import { SubcategoryService } from '../subcategories/subcategories.service';
import { RoleEnum } from '../roles/roles.enum';
import { User } from '../users/domain/user';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly categoriesService: CategoriesService,
    private readonly subcategoriesService: SubcategoryService,
    private readonly languageService: LanguageService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCourseDto | null;
    sortOptions?: SortCourseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Course[]> {
    return this.courseRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  findOne({ id }: { id: number }): Promise<Course> {
    return this.courseRepository.findOne({ id: id });
  }

  async create({
    data,
    userId,
  }: {
    data: CreateCourseDto;
    userId: User['id'];
  }): Promise<Course> {
    data.instructors.push({ id: userId } as User);
    const result = await this.validateData(data);
    if (
      result?.some((item) =>
        item?.hasOwnProperty('role')
          ? item?.role.id !== RoleEnum.instructor &&
            item?.role.id !== RoleEnum.admin
          : false,
      )
    ) {
      throw new BadRequestException('All users must be instructors or admins');
    }
    return this.courseRepository.create(data);
  }

  async update({
    id,
    data,
    userId,
  }: {
    id: number;
    data: UpdateCourseDto;
    userId: User['id'];
  }): Promise<Course | null> {
    const result = await this.validateData(data);
    if (
      !result?.some((item) =>
        item?.hasOwnProperty('role') ? (item as User)?.id === userId : false,
      )
    ) {
      throw new HttpException(
        'You are not an instructor of this course',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.courseRepository.update(id, data);
  }

  async delete({
    id,
    userId,
  }: {
    id: number;
    userId: User['id'];
  }): Promise<any> {
    const course = await this.findOne({ id });
    if (!course.instructors.some((instructor) => instructor.id === userId)) {
      throw new HttpException(
        'You are not an instructor of this course',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.courseRepository.softDelete(id);
  }

  async validateData(data: Partial<CreateCourseDto>): Promise<any[]> {
    const promises: Promise<any | null>[] = [];
    if (data.category) {
      promises.push(
        this.categoriesService.findOne({
          id: data.category.id,
        }),
      );
    }
    if (data.subcategory) {
      promises.push(
        this.subcategoriesService.findOne({
          id: data.subcategory.id,
        }),
      );
    }
    if (data.language) {
      promises.push(
        this.languageService.findOne({
          id: data.language.id,
        }),
      );
    }
    if (data.subtitleLanguage) {
      data.subtitleLanguage.forEach((language) => {
        promises.push(this.languageService.findOne({ id: language.id }));
      });
    }
    if (data.thumbnail) {
      promises.push(
        this.filesService.findOne({
          id: data.thumbnail.id,
        }),
      );
    }
    if (data.trailer) {
      promises.push(
        this.filesService.findOne({
          id: data.trailer.id,
        }),
      );
    }
    if (data.instructors) {
      data.instructors.forEach((instructor) => {
        promises.push(this.usersService.findOne({ id: instructor.id }));
      });
    }

    const result = await Promise.all(promises);
    if (result.includes(null)) {
      throw new BadRequestException('Invalid data');
    }
    return result;
  }
}

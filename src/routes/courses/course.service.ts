import { Category } from './../categories/domain/category';
import { UsersService } from './../users/users.service';
import { FilesService } from './../files/files.service';
import { LanguageService } from './../languages/language.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CourseRepository } from './infastructure/persistence/course.repository';
import { FilterCourseDto, SortCourseDto } from './dto/query-course.dto';
import { Course } from './domain/course';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CategoriesService } from '../categories/categories.service';
import { SubcategoryService } from '../subcategories/subcategories.service';
import { RoleEnum } from '../roles/roles.enum';

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
    categoryId?: Category['id'];
  }): Promise<Course[]> {
    return this.courseRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  findOne({ id }: { id: number }): Promise<Course | null> {
    return this.courseRepository.findOne({ id: id });
  }

  async create(data: CreateCourseDto): Promise<Course> {
    const category = this.categoriesService.findOne({
      id: data.category.id,
    });
    const subcategory = this.subcategoriesService.findOne({
      id: data.subcategory.id,
    });
    const language = this.languageService.findOne({
      id: data.language.id,
    });
    const subtitleLanguage = data.subtitleLanguage.map((language) =>
      this.languageService.findOne({ id: language.id }),
    );
    const thumbnail = this.filesService.findOne({
      id: data.thumbnail.id,
    });
    const trailer = this.filesService.findOne({
      id: data.trailer.id,
    });
    const instructors = data.instructors.map((instructor) =>
      this.usersService.findOne({ id: instructor.id }),
    );
    const result = await Promise.all([
      category,
      subcategory,
      language,
      thumbnail,
      trailer,
      ...subtitleLanguage,
      ...instructors,
    ]);
    if (result.includes(null)) {
      throw new BadRequestException('Invalid data');
    }
    if (
      result?.some((item) =>
        item?.hasOwnProperty('role')
          ? // @ts-expect-error works fine
            item?.role.id !== RoleEnum.instructor
          : false,
      )
    ) {
      throw new BadRequestException('All users must be instructors');
    }
    return this.courseRepository.create(data);
  }

  update(
    { id }: { id: number },
    data: UpdateCourseDto,
  ): Promise<Course | null> {
    return this.courseRepository.update(id, data);
  }

  async delete({ id }: { id: number }): Promise<void> {
    return this.courseRepository.softDelete(id);
  }
}

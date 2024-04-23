// import { CourseService } from '../courses/course.service';
import {
  BadRequestException,
  // ForbiddenException,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { ProgressRepository } from './infastructure/persistence/section.repository';
import { FilterProgressDto, SortProgressDto } from './dto/query-progress.dto';
import { Progress } from './domain/progress';
import { CreateProgressDto } from './dto/create-progress.dto';
// import { User } from '../users/domain/user';
import { LectureService } from '../lectures/lecture.service';
import { UsersService } from '../users/users.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
// import { UpdateProgressDto } from './dto/update-progress.dto';
// import { CreateProgressDto } from './dto/create-progress.dto';
// import { User } from '../users/domain/user';

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly lectureService: LectureService,
    private readonly userService: UsersService,
  ) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProgressDto | null;
    sortOptions?: SortProgressDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Progress[]> {
    return this.progressRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  findOne({ id }: { id: number }): Promise<Progress> {
    return this.progressRepository.findOne({ id: id });
  }

  async create(data: CreateProgressDto): Promise<Progress> {
    const lecture = await this.lectureService.findOne({
      id: data.lecture.id,
      // userId: data.user.id,
    });
    if (!lecture) {
      throw new BadRequestException('lecture not found');
    }
    const user = await this.userService.findOne({
      id: data.user.id,
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }

    return this.progressRepository.create({ ...data });
  }

  async update(
    { id }: { id: number },
    data: UpdateProgressDto,
  ): Promise<Progress | null> {
    // await this.validateUserHasAccess({ userId, sectionId: id });
    return this.progressRepository.update(id, data);
  }

  async delete({ id }: { id: Progress['id'] }): Promise<void> {
    return this.progressRepository.softDelete(id);
  }

  // async validateUserHasAccess({
  //   userId,
  //   sectionId,
  // }: {
  //   userId: User['id'];
  //   sectionId: Section['id'];
  // }): Promise<void> {
  //   const section = await this.sectionRepository.findOne(
  //     {
  //       id: sectionId,
  //     },
  //     ['course'],
  //   );
  //   if (
  //     !section.course.instructors.some((instructor) => instructor.id === userId)
  //   ) {
  //     throw new ForbiddenException('User does not have access to this section');
  //   }
  // }
}

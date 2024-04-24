import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './domain/lecture';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { Section } from '../sections/domain/section';
import { FilterLectureDto, SortLectureDto } from './dto/query-lecture.dto';
import { SectionService } from '../sections/section.service';
import { LectureRepository } from './infastructure/persistence/lecture.repository';
import { FilesService } from '../files/files.service';
import { User } from '../users/domain/user';

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly sectionService: SectionService,
    private readonly filesService: FilesService,
  ) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    sectionId,
  }: {
    filterOptions?: FilterLectureDto | null;
    sortOptions?: SortLectureDto[] | null;
    paginationOptions: IPaginationOptions;
    sectionId: Section['id'];
  }): Promise<Lecture[]> {
    return this.lectureRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
      sectionId,
    });
  }

  async findOne({ id }: { id: number }): Promise<Lecture> {
    return this.lectureRepository.findOne({ id: id });
  }

  async create(data: CreateLectureDto, userId: User['id']): Promise<Lecture> {
    const result = await Promise.all([
      this.sectionService.validateUserHasAccess({
        userId,
        sectionId: data.section.id,
      }),
      this.filesService.findOne({
        id: data.attachement.id,
      }),
      this.filesService.findOne({
        id: data.video.id,
      }),
    ]);
    // this is a just in case check all the above promises are supposed to throw err if not found
    if (result.includes(null)) {
      throw new BadRequestException('Section, attachement or video not found');
    }
    return this.lectureRepository.create(data);
  }

  async update(
    { id, userId }: { id: number; userId: User['id'] },
    data: UpdateLectureDto,
  ): Promise<Lecture | null> {
    await this.validateUserCanEdit({ userId, lectureId: id });
    return this.lectureRepository.update(id, data);
  }

  async delete({
    id,
    userId,
  }: {
    id: number;
    userId: User['id'];
  }): Promise<void> {
    await this.validateUserCanEdit({ userId, lectureId: id });
    return this.lectureRepository.softDelete(id);
  }

  async validateUserCanEdit({
    userId,
    lectureId,
  }: {
    userId: User['id'];
    lectureId: Lecture['id'];
  }): Promise<void> {
    const lecture = await this.lectureRepository.findOne({ id: lectureId }, [
      'section',
    ]);
    await this.sectionService.validateUserHasAccess({
      userId,
      sectionId: lecture.section.id,
    });
  }
}

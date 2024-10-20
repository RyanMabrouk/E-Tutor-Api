import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { User } from './domain/user';
import { StatusEnum } from '../../routes/statuses/statuses.enum';
import { RoleEnum } from '../../routes/roles/roles.enum';
import { FilesService } from '../../routes/files/files.service';
import bcrypt from 'bcryptjs';
import { isUUID } from 'validator';
import { UUID } from 'crypto';
import { FileDto } from '../../routes/files/dto/file.dto';
import { RoleDto } from '../../routes/roles/dto/role.dto';
import { StatusDto } from '../../routes/statuses/dto/status.dto';
import { Course } from '../courses/domain/course';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      let userObject: User | null = null;
      try {
        userObject = await this.usersRepository.findOne({
          email: clonedPayload.email,
        });
      } catch (err) {
        // Ignore User not found error
        if (err.message !== 'User not found')
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              errors: {
                email: 'Internal server error',
              },
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
      if (userObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'Email already exists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.getFileObject(clonedPayload.photo?.id);
      clonedPayload.photo = fileObject;
    }

    this.vlaidteRole(clonedPayload.role);
    this.validateStatus(clonedPayload.status);

    return this.usersRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }

  findOne(
    fields: EntityCondition<User>,
    relations?: string[],
  ): Promise<User | null> {
    return this.usersRepository.findOne(fields, relations);
  }
  findOneOrNull(fields: EntityCondition<User>): Promise<User | null> {
    return this.usersRepository.findOneOrNull(fields);
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const isValidEmail = await this.usersRepository.isValidEmail({
        id,
        email: clonedPayload.email,
      });
      if (!isValidEmail) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'Email already exists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.getFileObject(clonedPayload.photo?.id);
      clonedPayload.photo = fileObject;
    }

    if (clonedPayload.role) this.vlaidteRole(clonedPayload.role as RoleDto);

    if (clonedPayload.status)
      this.validateStatus(clonedPayload.status as StatusDto);
    try {
      const validPayload = {
        ...clonedPayload,
        courses: clonedPayload.courses
          ? (clonedPayload.courses.filter(
              (course) => course !== undefined,
            ) as Course[])
          : [],
      };
      const updated = await this.usersRepository.update(
        id,
        validPayload as any,
      );
      return updated;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
  async getFileObject(photoId: UUID): Promise<FileDto> {
    if (!isUUID(photoId)) {
      throw new BadRequestException('Invalid UUID for photo id');
    }
    const fileObject = await this.filesService.findOne({
      id: photoId,
    });
    if (!fileObject) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'Image doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return fileObject;
  }
  vlaidteRole(role: RoleDto | null | undefined): void {
    if (!role?.id || !Object.values(RoleEnum).includes(role?.id)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'Role doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  validateStatus(status: StatusDto | null | undefined): void {
    if (!status?.id || !Object.values(StatusEnum).includes(status?.id)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'Status doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async validateUser(userId: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }
  }
}

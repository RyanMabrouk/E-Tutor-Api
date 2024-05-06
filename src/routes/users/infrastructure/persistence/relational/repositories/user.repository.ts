import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<User>,
    relations?: FindOneOptions<UserEntity>['relations'],
  ): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
      relations,
    });
    if (!entity) {
      throw new BadRequestException('User not found');
    }

    return UserMapper.toDomain(entity);
  }
  async findOneOrNull(
    fields: EntityCondition<User>,
    relations?: FindOneOptions<UserEntity>['relations'],
  ): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
      relations,
    });
    if (!entity) {
      return null;
    }

    return UserMapper.toDomain(entity);
  }

  async isValidEmail({
    email,
    id,
  }: {
    email: string;
    id: User['id'];
  }): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return (user !== null && user?.id === id) || user === null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const domain = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });
    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
  async findAllUsers(): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder();
    const entities = await queryBuilder
      .select(['user.id', 'user.learningGoal'])
      .from('user', 'user')
      .getMany();

    return entities.map((user) => UserMapper.toDomain(user));
  }
}

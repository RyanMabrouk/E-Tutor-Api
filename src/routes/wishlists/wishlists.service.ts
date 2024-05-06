import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { Wishlist } from './domain/wishlist';
import { WishlistRepository } from './infastructure/persistence/wishlist.repository';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { FilterWishlistDto, SortWishlistDto } from './dto/query-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/domain/user';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { CourseService } from '../courses/course.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly userRepository: UserRepository,
    private readonly coursesService: CourseService,
  ) {}

  async create(
    createPayload: CreateWishlistDto,
    ownerId: User['id'],
  ): Promise<Wishlist> {
    try {
      const user = await this.userRepository.findOne({ id: ownerId });

      const created = await this.wishlistRepository.create({
        ...createPayload,
        user,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterWishlistDto | null;
    sortOptions?: SortWishlistDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: User['id'];
  }): Promise<Wishlist[]> {
    return this.wishlistRepository.findManyWithPagination({
      filterOptions: { ...filterOptions, user: { id: userId as number } },
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({ id: id });
  }

  async update(
    id: number,
    updatePayload: UpdateWishlistDto,
  ): Promise<Wishlist | null> {
    try {
      const updated = await this.wishlistRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Wishlist doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number) {
    return this.wishlistRepository.softDelete(id);
  }
}

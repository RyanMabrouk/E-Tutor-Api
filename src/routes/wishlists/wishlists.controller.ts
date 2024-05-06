import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/routes/roles/roles.guard';
import { WishlistService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { QueryWishlistDto } from './dto/query-wishlist.dto';
import { Wishlist } from './domain/wishlist';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wishlists')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'wishlists', version: '1' })
export class WishlistController {
  constructor(private readonly wishlistsService: WishlistService) {}

  @Post()
  create(@Body() createDto: CreateWishlistDto, @User() user: JwtPayloadType) {
    return this.wishlistsService.create(createDto, user.id);
  }

  @Get()
  async findAll(
    @Query() query: QueryWishlistDto,
    @User() user: JwtPayloadType,
  ): Promise<InfinityPaginationResultType<Wishlist>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.wishlistsService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          userId: user.id,
        }),
        { page, limit },
      );
      return {
        ...data,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.wishlistsService.findOne(id);
  }

  @Patch()
  update(
    @Body() updateWishlisttDto: UpdateWishlistDto,
    @User() user: JwtPayloadType,
  ) {
    return this.wishlistsService.update(user.id as number, updateWishlisttDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { PurshaseRepository } from './infastructure/persistence/purshase.repository';
import { FilterPurshaseDto, SortPurshaseDto } from './dto/query-purshase.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Purshase } from './domain/purshase';
import { CreatePurshaseDto } from './dto/create-purshase.dto';
import Stripe from 'stripe';

@Injectable()
export class PurshasesService {
  private stripe: Stripe;

  constructor(private readonly purshaseRepository: PurshaseRepository) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-04-10',
    });
  }
  checkout(cart: CreatePurshaseDto[]) {
    console.log(cart);
    return this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-Shirt',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPurshaseDto | null;
    sortOptions?: SortPurshaseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Purshase[]> {
    return this.purshaseRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({ id }: { id: number }): Promise<Purshase | null> {
    return this.purshaseRepository.findOne({ id });
  }

  // async create(data: CreateCategoryDto): Promise<Category> {
  //   const category = await this.purshaseRepository.create(data);
  //   console.log(category);
  //   return category;
  // }

  // async update(
  //   { id }: { id: number },
  //   data: UpdateCategoryDto,
  // ): Promise<Category | null> {
  //   return this.purshaseRepository.update(id, data);
  // }

  // async delete({ id }: { id: number }): Promise<void> {
  //   return this.purshaseRepository.softDelete(id);
  // }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { RefundRepository } from './infastructure/persistence/refund.repository';
import { FilterRefundDto, SortRefundDto } from './dto/query-refund.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Refund } from './domain/refund';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { PurshasesService } from '../purshases/purshases.service';

@Injectable()
export class RefundsService {
  constructor(
    private readonly refundRepository: RefundRepository,
    private readonly purshasesService: PurshasesService,
  ) {}

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterRefundDto | null;
    sortOptions?: SortRefundDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Refund[]> {
    return this.refundRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({ id }: { id: number }): Promise<Refund> {
    return this.refundRepository.findOne({ id });
  }

  async create(data: CreateRefundDto): Promise<Refund> {
    const purshase = await this.purshasesService.findOne({
      field: { paymentIntentId: data.intentPaymentId },
    });

    if (!purshase) {
      throw new BadRequestException('Purshase not found');
    }
    const isExceededTimeLimit =
      new Date(Date.now()) >
      new Date(purshase.expiryDate.getTime() + 24 * 60 * 60 * 1000);
    if (isExceededTimeLimit) {
      throw new BadRequestException('Time limit exceeded');
    }

    const refund = await this.refundRepository.create(data);
    return refund;
  }

  async update(
    { id }: { id: number },
    data: UpdateRefundDto,
  ): Promise<Refund | null> {
    return this.refundRepository.update(id, data);
  }

  async delete({ id }: { id: number }): Promise<void> {
    return this.refundRepository.softDelete(id);
  }
}

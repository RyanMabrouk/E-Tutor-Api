import { Injectable } from '@nestjs/common';
import { User } from 'src/routes/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { SessionRepository } from './infrastructure/persistence/session.repository';
import { Session } from './domain/session';
import { NullableType } from 'src/utils/types/nullable.type';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findOne(options: EntityCondition<Session>): Promise<NullableType<Session>> {
    return this.sessionRepository.findOne(options);
  }

  create(data: Omit<Session, GeneralDomainKeysWithId>): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<Omit<Session, GeneralDomainKeysWithId>>,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  async softDelete(criteria: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete(criteria);
  }
}

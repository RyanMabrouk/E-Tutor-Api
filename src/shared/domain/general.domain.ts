export class GeneralDomain {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const GeneralDomainKeysArray = ['createdAt', 'updatedAt', 'deletedAt'];

export type GeneralDomainKeysWithId =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

export type GeneralDomainKeys = 'createdAt' | 'updatedAt' | 'deletedAt';

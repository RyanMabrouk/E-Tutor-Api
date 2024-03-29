export class GeneralDomain {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type GeneralDomainKeysWithId =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';
export type GeneralDomainKeys = 'createdAt' | 'updatedAt' | 'deletedAt';

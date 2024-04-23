import { GeneralDomain } from '../../src/shared/domain/general.domain';

export const GeneralDomainMock: GeneralDomain = {
  createdAt: expect.any(String) as Date,
  updatedAt: expect.any(String) as Date,
  deletedAt: null,
};

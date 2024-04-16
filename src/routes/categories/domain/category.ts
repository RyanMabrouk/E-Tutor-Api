import { GeneralDomain } from '../../../shared/domain/general.domain';

export class Category extends GeneralDomain {
  id: number;
  name: string;
  color: string;
}

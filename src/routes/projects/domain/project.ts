import { User } from 'src/routes/users/domain/user';
import { GeneralDomain } from 'src/shared/domain/general.domain';

export class Project extends GeneralDomain {
  id: number;
  title: string;
  description: string | null;
  members: User[];
  due_date: Date;
}

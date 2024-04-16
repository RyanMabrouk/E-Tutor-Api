import { Exclude, Expose } from 'class-transformer';
import { FileType } from 'src/routes/files/domain/file';
import { Role } from 'src/routes/roles/domain/role';
import { GeneralDomain } from 'src/shared/domain/general.domain';
import { Status } from 'src/routes/statuses/domain/status';

export class User extends GeneralDomain {
  id: number | string;
  firstName: string | null;
  lastName: string | null;
  username?: string;
  title?: string;
  bigoraphie?: string;
  persenalWebsite?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
  photo?: FileType | null;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  role?: Role | null;
  status?: Status;
  socialId?: string | null;
}

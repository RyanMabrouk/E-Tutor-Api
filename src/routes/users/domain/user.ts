import { Exclude, Expose } from 'class-transformer';
import { FileType } from 'src/routes/files/domain/file';
import { Role } from 'src/routes/roles/domain/role';
import { GeneralDomain } from 'src/shared/domain/general.domain';
import { Status } from 'src/routes/statuses/domain/status';

export class User extends GeneralDomain {
  id: number | string;
  firstName: string | null;
  lastName: string | null;
  username?: string | null;
  title?: string | null;
  bigoraphie?: string | null;
  persenalWebsite?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  photo?: FileType | null;
  role?: Role | null;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  status?: Status;
  socialId?: string | null;
}

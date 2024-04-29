import { AppConfig } from './app-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../routes/files/config/file-config.type';
import { MailConfig } from '../shared/services/mail/config/mail-config.type';
import { GoogleConfig } from 'src/auth-google/config/google-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  google: GoogleConfig;
};

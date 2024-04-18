import { FileType } from 'src/routes/files/domain/file';
import { GeneralDomain } from '../../../shared/domain/general.domain';
import { Section } from 'src/routes/sections/domain/section';
export class Lecture extends GeneralDomain {
  id: number;
  name: string;
  section: Section;
  video: FileType;
  attachement: FileType;
  captions: string[];
  descripstion: string;
}

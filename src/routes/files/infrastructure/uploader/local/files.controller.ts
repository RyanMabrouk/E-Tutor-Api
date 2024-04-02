import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesLocalService } from './files.service';
import { FileInterceptor, MemoryStorageFile } from '@blazity/nest-file-fastify';
import { FastifyReply } from 'fastify';
import { join } from 'path';
import { appRoot } from 'src/main';
import { createReadStream } from 'fs';
@Controller({
  path: 'files',
  version: '1',
})
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MemoryStorageFile) {
    console.log('🚀 ~ FilesLocalController ~ uploadFile ~ file:', { ...file });
    return this.filesService.create(file);
  }

  @Get(':path')
  download(@Param('path') path: string, @Response() res: FastifyReply) {
    try {
      const filePath = join(appRoot, 'files', path); // Adjust the path as needed
      const stream = createReadStream(filePath);
      void res.send(stream);
    } catch (err) {
      throw new BadRequestException("File doesn't exist");
    }
  }
}
